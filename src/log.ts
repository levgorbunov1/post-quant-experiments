import { promises as fs } from "fs";

const logFile = "benchmark.log";

export async function log(message: string) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  await fs.appendFile(logFile, line);
}
