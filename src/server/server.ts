import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";

import { BlastRadiusService } from "../graph/blast-radius-service.js";
import { HydraDbClient, hydraDbConfigFromEnv } from "../hydradb/client.js";
import { handleApiRequest } from "./api.js";

const appPort = Number(process.env.BLASTRADIUS_PORT ?? 8787);
const publicRoot = resolve(process.cwd(), "dist");
const blastRadius = new BlastRadiusService(new HydraDbClient(hydraDbConfigFromEnv()));

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "127.0.0.1"}`);
    if (url.pathname.startsWith("/api/")) {
      const apiResponse = await handleApiRequest(await toWebRequest(request, url), { blastRadius });
      await writeWebResponse(response, apiResponse);
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: { code: "server_error", message: "Unexpected server error." } }));
  }
});

server.listen(appPort, "127.0.0.1", () => {
  console.log(`BlastRadius listening at http://127.0.0.1:${appPort}`);
});

const toWebRequest = async (request: IncomingMessage, url: URL): Promise<Request> => {
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await readRequestBody(request);
  return new Request(url, {
    method: request.method,
    headers: request.headers as HeadersInit,
    ...(body ? { body } : {}),
  });
};

const readRequestBody = async (request: IncomingMessage): Promise<string> => {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 1_000_000) {
      throw new RangeError("Request body exceeds 1 MB.");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const writeWebResponse = async (response: ServerResponse, webResponse: Response): Promise<void> => {
  response.writeHead(webResponse.status, Object.fromEntries(webResponse.headers.entries()));
  response.end(Buffer.from(await webResponse.arrayBuffer()));
};

const serveStatic = async (pathname: string, response: ServerResponse): Promise<void> => {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const resolvedPath = resolve(publicRoot, `.${requested}`);
  const filePath = resolvedPath.startsWith(publicRoot) && (await isFile(resolvedPath))
    ? resolvedPath
    : resolve(publicRoot, "index.html");
  const content = await readFile(filePath);
  response.writeHead(200, {
    "Content-Type": contentType(filePath),
    "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable",
  });
  response.end(content);
};

const isFile = async (path: string): Promise<boolean> => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

const contentType = (path: string): string =>
  ({
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".json": "application/json",
  })[extname(path)] ?? "application/octet-stream";
