// https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf
// https://github.com/paulmillr/noble-post-quantum?tab=readme-ov-file#ml-dsa--dilithium-signatures
// ML-DSA-44 for 128-bit security level. Not recommended after 2030, as per ASD.
// ML-DSA-65 for 192-bit security level. Not recommended after 2030, as per ASD.
// ML-DSA-87 for 256-bit security level. OK after 2030, as per ASD.
import { ml_dsa44, ml_dsa65, ml_dsa87 } from "@noble/post-quantum/ml-dsa";

import { randomBytes } from "@noble/post-quantum/utils";
import { base64urlEncode } from "../utils";
import type { Payload } from "../payload";
import type { DilithiumAlgorithms } from "./types";

export const jwtDilithium = (
  payload: Payload,
  header = { alg: "ML-DSA65", typ: "JWT" },
) => {
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const messageBytes = new TextEncoder().encode(signingInput);
  const seed = randomBytes(32); // seed is optional
  const keys = ml_dsa65.keygen(seed);
  const signature = ml_dsa65.sign(keys.secretKey, messageBytes);
  const encodedSig = base64urlEncode(signature);
  const mldsa65_token = `${signingInput}.${encodedSig}`;
  const mldsa65_size = Buffer.byteLength(mldsa65_token, "utf8");

  return { mldsa65_token, mldsa65_size };
};

const getDilithiumImpl = (alg: DilithiumAlgorithms) => {
  const map = {
    "ML-DSA-44": ml_dsa44,
    "ML-DSA-65": ml_dsa65,
    "ML-DSA-87": ml_dsa87,
  } satisfies Record<DilithiumAlgorithms, unknown>;

  return map[alg];
};

export const createFIPS204JWT = (
  payload: Payload,
  alg: DilithiumAlgorithms,
) => {
  const header = { alg, typ: "JWT" };
  const impl = getDilithiumImpl(alg);
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const messageBytes = new TextEncoder().encode(signingInput);
  const seed = randomBytes(32); // seed is optional
  const keys = impl.keygen(seed);
  const signature = impl.sign(keys.secretKey, messageBytes);
  const encodedSig = base64urlEncode(signature);
  const token = `${signingInput}.${encodedSig}`;
  const size = Buffer.byteLength(token, "utf8");

  return { token, size };
};
