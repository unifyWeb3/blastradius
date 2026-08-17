import { mkdir, writeFile } from "node:fs/promises";

const debuggingUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9222";
const appUrl = process.env.BLASTRADIUS_URL ?? "http://127.0.0.1:8787";
const outputDirectory = process.env.UI_SMOKE_OUTPUT ?? "docs/validation/browser-smoke";
const viewportWidth = Number(process.env.UI_SMOKE_WIDTH ?? 1440);
const viewportHeight = Number(process.env.UI_SMOKE_HEIGHT ?? 1000);
const mode = process.env.UI_SMOKE_MODE === "error" ? "error" : "success";

interface CdpResponse {
  id?: number;
  result?: Record<string, unknown>;
  error?: { message: string };
  method?: string;
  params?: Record<string, unknown>;
}

interface PendingCommand {
  resolve: (result: Record<string, unknown>) => void;
  reject: (error: Error) => void;
}

const pages = (await fetchJson(`${debuggingUrl}/json/list`)) as Array<{
  type: string;
  webSocketDebuggerUrl: string;
}>;
const page = pages.find((candidate) => candidate.type === "page");
if (!page) {
  throw new Error("No debuggable Chromium page is available.");
}

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise<void>((resolve, reject) => {
  socket.addEventListener("open", () => resolve(), { once: true });
  socket.addEventListener("error", () => reject(new Error("Could not connect to Chromium DevTools.")), { once: true });
});

let commandId = 0;
const pending = new Map<number, PendingCommand>();
const browserErrors: string[] = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(String(event.data)) as CdpResponse;
  if (message.id) {
    const command = pending.get(message.id);
    if (!command) return;
    pending.delete(message.id);
    if (message.error) command.reject(new Error(message.error.message));
    else command.resolve(message.result ?? {});
    return;
  }

  if (message.method === "Runtime.exceptionThrown") {
    browserErrors.push(JSON.stringify(message.params));
  }
  if (message.method === "Log.entryAdded") {
    const entry = message.params?.entry as { level?: string; text?: string } | undefined;
    if (entry?.level === "error") browserErrors.push(entry.text ?? "Browser log error");
  }
  if (message.method === "Runtime.consoleAPICalled") {
    const type = message.params?.type;
    if (type === "error") browserErrors.push(JSON.stringify(message.params));
  }
});

const send = (method: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> => {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
};

await Promise.all([send("Page.enable"), send("Runtime.enable"), send("Log.enable"), send("Network.enable")]);
await send("Emulation.setDeviceMetricsOverride", {
  width: viewportWidth,
  height: viewportHeight,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url: appUrl });
await waitFor("document.readyState === 'complete' && document.body.innerText.includes('BlastRadius')");
await waitFor("document.body.innerText.includes('Analysis pending')");

const initial = await evaluate(`({
  title: document.title,
  hasEmptyState: document.body.innerText.includes('Analysis pending'),
  hasHydraLabel: document.body.innerText.includes('incoming SSpaths'),
  analyzeButtonEnabled: ![...document.querySelectorAll('button')].find(button => button.textContent?.includes('Analyze blast radius'))?.disabled
})`);

await send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 500,
  downloadThroughput: -1,
  uploadThroughput: -1,
  connectionType: "wifi",
});
await evaluate(`(() => {
  const button = [...document.querySelectorAll('button')].find(button => button.textContent?.includes('Analyze blast radius'));
  if (!(button instanceof HTMLButtonElement)) throw new Error('Analyze button was not found.');
  button.click();
  return true;
})()`);
await waitFor("document.body.innerText.includes('Querying HydraDB')");
const loadingState = await evaluate(`({
  hasLoadingMessage: document.body.innerText.includes('Querying HydraDB'),
  analyzeButtonDisabled: document.querySelector('.primary-button')?.disabled === true
})`);
await send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 0,
  downloadThroughput: -1,
  uploadThroughput: -1,
  connectionType: "wifi",
});

if (mode === "error") {
  await waitFor("Boolean(document.querySelector('.error-banner'))", 30_000);
  const errorState = await evaluate(`({
    message: document.querySelector('.error-banner span')?.textContent,
    hasAlertRole: document.querySelector('.error-banner')?.getAttribute('role') === 'alert',
    analysisStillEmpty: document.querySelectorAll('.react-flow__node').length === 0
  })`);
  await writeEvidence({ initial, loadingState, errorState });
  socket.close();

  const typedLoading = loadingState as { hasLoadingMessage?: boolean; analyzeButtonDisabled?: boolean };
  const typedError = errorState as { message?: string; hasAlertRole?: boolean; analysisStillEmpty?: boolean };
  const unexpectedBrowserErrors = browserErrors.filter(
    (entry) => !entry.startsWith("Failed to load resource:"),
  );
  if (
    !typedLoading.hasLoadingMessage ||
    !typedLoading.analyzeButtonDisabled ||
    typedError.message !== "HydraDB could not complete the graph operation." ||
    !typedError.hasAlertRole ||
    !typedError.analysisStillEmpty ||
    unexpectedBrowserErrors.length > 0
  ) {
    throw new Error("Browser error-state smoke test failed.");
  }
  process.exit(0);
}

await waitFor("document.querySelectorAll('.react-flow__node').length >= 6", 30_000);
await waitFor("document.querySelector('.summary-metric--danger strong')?.textContent === '1'");

const analysis = await evaluate(`({
  exposedCount: document.querySelector('.summary-metric--danger strong')?.textContent,
  graphNodes: document.querySelectorAll('.react-flow__node').length,
  graphEdges: document.querySelectorAll('.react-flow__edge').length,
  hasMerchantPath: document.body.innerText.includes('merchant-web package-lock.json'),
  hasTemporalEvidence: document.body.innerText.includes('Effective exposure'),
  hasHydraTraversal: document.body.innerText.includes('incoming · 6 hops')
})`);

await evaluate(`(() => {
  const select = document.querySelector('.check-block select');
  if (!(select instanceof HTMLSelectElement)) throw new Error('Application check select was not found.');
  select.value = 'app:analytics-worker';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  return select.value;
})()`);
await waitFor("document.querySelector('.check-block select')?.value === 'app:analytics-worker'");
await evaluate(`(() => {
  const button = [...document.querySelectorAll('button')].find(button => button.textContent?.includes('Check exposure'));
  if (!(button instanceof HTMLButtonElement)) throw new Error('Exposure check button was not found.');
  button.click();
  return true;
})()`);
await waitFor("document.body.innerText.includes('No supporting dependency path found.')", 30_000);

const negativeCase = await evaluate(`({
  application: document.querySelector('.check-block select')?.value,
  status: document.querySelector('.check-result strong')?.textContent,
  message: document.querySelector('.check-result span')?.textContent
})`);

const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
  fromSurface: true,
});
const screenshotData = screenshot.data;
if (typeof screenshotData !== "string") {
  throw new Error("Chromium did not return screenshot data.");
}

const evidence = {
  appUrl,
  mode,
  viewport: { width: viewportWidth, height: viewportHeight },
  initial,
  loadingState,
  analysis,
  negativeCase,
  browserErrors,
  passed:
    Boolean((initial as { hasEmptyState?: boolean }).hasEmptyState) &&
    Boolean((loadingState as { hasLoadingMessage?: boolean }).hasLoadingMessage) &&
    Boolean((loadingState as { analyzeButtonDisabled?: boolean }).analyzeButtonDisabled) &&
    (analysis as { exposedCount?: string }).exposedCount === "1" &&
    ((analysis as { graphNodes?: number }).graphNodes ?? 0) >= 6 &&
    (negativeCase as { message?: string }).message === "No supporting dependency path found." &&
    browserErrors.length === 0,
};
await mkdir(outputDirectory, { recursive: true });
await writeFile(`${outputDirectory}/incident-analysis.png`, Buffer.from(screenshotData, "base64"));
await writeFile(`${outputDirectory}/result.json`, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
socket.close();

if (!evidence.passed) {
  throw new Error("Browser smoke test failed.");
}

async function evaluate(expression: string): Promise<unknown> {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  const exception = result.exceptionDetails as { text?: string } | undefined;
  if (exception) throw new Error(exception.text ?? "Browser evaluation failed.");
  const remote = result.result as { value?: unknown } | undefined;
  return remote?.value;
}

async function waitFor(expression: string, timeoutMs = 15_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for browser expression: ${expression}`);
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`DevTools endpoint returned HTTP ${response.status}.`);
  return response.json();
}

async function writeEvidence(states: Record<string, unknown>): Promise<void> {
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
  });
  if (typeof screenshot.data !== "string") {
    throw new Error("Chromium did not return screenshot data.");
  }
  const evidence = {
    appUrl,
    mode,
    viewport: { width: viewportWidth, height: viewportHeight },
    ...states,
    browserErrors,
  };
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(`${outputDirectory}/incident-analysis.png`, Buffer.from(screenshot.data, "base64"));
  await writeFile(`${outputDirectory}/result.json`, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence, null, 2));
}
