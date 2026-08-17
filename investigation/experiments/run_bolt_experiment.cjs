const { mkdir, writeFile } = require("node:fs/promises");
const { performance } = require("node:perf_hooks");
const neo4j = require("neo4j-driver");

const uri = process.env.BOLT_URL || "bolt://127.0.0.1:17687";
const token = process.env.TOKEN || "hydradb-investigation-token-32-bytes";
const outputDir =
  process.env.OUT || "investigation/results/bolt";

function normalize(value) {
  if (neo4j.isInt(value)) return value.inSafeRange() ? value.toNumber() : value.toString();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalize(item)]),
    );
  }
  return value;
}

async function runQuery(session, name, query, parameters = {}) {
  const started = performance.now();
  const result = await session.run(query, parameters);
  return {
    name,
    query,
    parameters,
    duration_ms: Number((performance.now() - started).toFixed(3)),
    rows: result.records.map((record) => normalize(record.toObject())),
    summary: {
      server: result.summary.server.agent,
      database: result.summary.database?.name || null,
      query_type: result.summary.queryType || null,
    },
  };
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const report = {
    uri,
    driver: require("neo4j-driver/package.json").version,
    checks: [],
  };

  const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", token), {
    connectionTimeout: 5_000,
  });
  try {
    const started = performance.now();
    await driver.verifyConnectivity();
    report.connectivity_ms = Number((performance.now() - started).toFixed(3));
    const session = driver.session({ database: "default" });
    try {
      report.checks.push(
        await runQuery(
          session,
          "bolt_persisted_multi_hop",
          "MATCH (p:Person {id: $id})-[:LINKS*1..3]->(q) RETURN q.id AS id ORDER BY id",
          { id: neo4j.int(10) },
        ),
      );
      report.checks.push(
        await runQuery(
          session,
          "bolt_no_evidence",
          "MATCH (m:Memory {subject: $subject}) RETURN m.value AS value",
          { subject: "not-present" },
        ),
      );
    } finally {
      await session.close();
    }
  } finally {
    await driver.close();
  }

  const rejected = neo4j.driver(uri, neo4j.auth.basic("neo4j", "wrong-token"), {
    connectionTimeout: 5_000,
  });
  try {
    await rejected.verifyConnectivity();
    report.wrong_auth = { rejected: false };
  } catch (error) {
    report.wrong_auth = {
      rejected: true,
      name: error.name,
      code: error.code || null,
      message: error.message,
    };
  } finally {
    await rejected.close();
  }

  await writeFile(
    outputDir + "/bolt.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
