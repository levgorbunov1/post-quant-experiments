// jwt.js
import crypto from "crypto";
import type { Payload } from "../payload";
import { base64urlEncode } from "../utils";

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
  const signature = sign(signingInput, secret);
  const token = `${signingInput}.${signature}`;
  const size = Buffer.byteLength(token, "utf8");

  return { token, size };
};
