import crypto from "crypto";
import { base64urlEncode } from "../utils";
import type { Payload } from "../payload";
import { syncBenchmark } from "../../benchmark";

const nodeAlgs: Record<"RS256" | "RS512" | "ES256" | "EdDSA", string> = {
  RS256: "RSA-SHA256",
  RS512: "RSA-SHA512",
  ES256: "sha256",
  EdDSA: undefined as any, // Ed25519 doesn't take an algorithm string
};

export const createAsymmetricJWT = (
  payload: Payload,
  keys: { privateKey: string | Buffer, publicKey: string | Buffer },
  alg: "RS256" | "RS512" | "ES256" | "EdDSA",
) => {
  const header = { alg, typ: "JWT" };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  let signature: Buffer;
  let sign_time: number;
  let verified: boolean;
  let verify_time: number;

  if (alg === "EdDSA") {
    // Ed25519: sign input directly, no hashing or padding
    ({ result: signature, time: sign_time } = syncBenchmark(`JWT signing with ${alg}`, () => crypto.sign(null, Buffer.from(signingInput), keys.privateKey)));

    ({result: verified, time: verify_time } = syncBenchmark(`JWT verification with ${alg}`, () => crypto.verify(null, Buffer.from(signingInput), keys.publicKey, signature)));
  } else {
    const nodeAlg = nodeAlgs[alg];
    if (!nodeAlg) throw new Error(`Unsupported algorithm: ${alg}`);

    ({ result: signature, time: sign_time } = syncBenchmark(`JWT signing with ${alg}`, () => crypto.sign(nodeAlg, Buffer.from(signingInput), { key: keys.privateKey, padding: alg.startsWith("RS") ? crypto.constants.RSA_PKCS1_PADDING : undefined })));

    ({result: verified, time: verify_time } = syncBenchmark(`JWT verification with ${alg}`, () => crypto.verify(nodeAlg, Buffer.from(signingInput), { key: keys.publicKey, padding: alg.startsWith("RS") ? crypto.constants.RSA_PKCS1_PADDING : undefined }, signature)));
  }

  const encodedSignature = base64urlEncode(signature);
  const token = `${signingInput}.${encodedSignature}`;
  const size = Buffer.byteLength(token, "utf8");

  return { token, size, time: {sign_time: sign_time, verify_time: verify_time} };
};
