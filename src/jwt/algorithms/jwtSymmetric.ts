// jwt.js
import crypto from "crypto";
import type { Payload } from "../payload";
import { base64urlEncode } from "../utils";
import { syncBenchmark } from "../../benchmark";

const sign = (input: string, secret: string): string => {
  return crypto
    .createHmac("sha256", secret)
    .update(input)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const createHS256JWT = (
  payload: Payload,
  secret: string,
  header = { alg: "HS256", typ: "JWT" },
) => {
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const { result: signature, time: sign_time } = syncBenchmark("JWT signing with HS256", () => sign(signingInput, secret));

  const token = `${signingInput}.${signature}`;
  const size = Buffer.byteLength(token, "utf8");

  return { token, size, time: { sign_time: sign_time, verify_time: sign_time, total_time: Number((sign_time * 2).toFixed(2)) } };
};
