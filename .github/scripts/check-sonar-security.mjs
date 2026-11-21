import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";

const { SONAR_TOKEN, SONAR_PROJECT_KEY, SONAR_PULL_REQUEST } = process.env;

if (!SONAR_TOKEN || !SONAR_PROJECT_KEY) {
  throw new Error("Configure SONAR_TOKEN and SONAR_PROJECT_KEY before running the SonarCloud check");
}

async function readSonarApi(path, parameters) {
  const url = new URL(path, "https://sonarcloud.io");
  url.search = new URLSearchParams(parameters);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${SONAR_TOKEN}` },
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`SonarCloud ${path} returned HTTP ${response.status}`);
  }
  return response.json();
}

async function waitForAnalysis(taskId) {
  const deadline = Date.now() + 300_000;
  while (Date.now() < deadline) {
    const { task } = await readSonarApi("/api/ce/task", { id: taskId });
    const status = task?.status;
    if (status === "SUCCESS") return;
    if (status !== "PENDING" && status !== "IN_PROGRESS") {
      throw new Error(`SonarCloud analysis stopped with status ${status ?? "unknown"}`);
    }
    await setTimeout(5_000);
  }
  throw new Error("Timed out waiting for SonarCloud analysis");
}

const metadata = await readFile(".scannerwork/report-task.txt", "utf8");
const taskId = /^ceTaskId=(.+)$/m.exec(metadata)?.[1].trim();
if (!taskId) {
  throw new Error("SonarCloud analysis task ID is missing from the scanner report");
}
await waitForAnalysis(taskId);

const query = {
  componentKeys: SONAR_PROJECT_KEY,
  impactSoftwareQualities: "SECURITY",
  resolved: "false",
  ps: "1",
};
if (SONAR_PULL_REQUEST) query.pullRequest = SONAR_PULL_REQUEST;

const { paging } = await readSonarApi("/api/issues/search", query);
const issueCount = paging?.total;
if (!Number.isSafeInteger(issueCount) || issueCount < 0) {
  throw new Error("SonarCloud did not return a valid security issue count");
}
console.log(`Open SonarCloud security issues: ${issueCount}`);
if (issueCount > 0) process.exitCode = 1;
