import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout } from "node:timers/promises";
import { test } from "node:test";

test("GET /api/health returns 200 with MongoDB connected", { timeout: 45_000 }, async (context) => {
  assert.ok(process.env.MONGODB_URI, "Set MONGODB_URI to a test database");

  const port = process.env.HEALTH_TEST_PORT ?? "3910";
  const server = spawn(process.execPath, [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname", "127.0.0.1",
    "--port", port,
  ], { stdio: "inherit" });
  const serverClosed = once(server, "close");
  context.after(async () => {
    server.kill();
    await serverClosed;
  });

  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    assert.equal(server.exitCode, null, "Next.js exited before the health check");

    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`, {
        signal: AbortSignal.timeout(5_000),
      });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { status: "ok" });
      return;
    } catch (error) {
      lastError = error;
    }

    await setTimeout(750);
  }

  throw new Error("Next.js did not report a healthy MongoDB connection", { cause: lastError });
});
