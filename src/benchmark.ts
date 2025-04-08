import { log } from "./log";

export async function benchmark<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<{ result: T; time: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const time = end - start;
  await log(`${label} took: ${time.toFixed(2)} ms`);
  return { result, time };
}
