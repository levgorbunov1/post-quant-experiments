import { log } from "./log";

export async function benchmark<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<{ result: T; time: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const time = Number((end - start).toFixed(2));
  await log(`${label} took: ${time} ms`);
  return { result, time };
}

export function syncBenchmark<T>(
  label: string,
  fn: () => T,
): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const time = Number((end - start).toFixed(2));
  log(`${label} took: ${time} ms`);
  return { result, time };
}
