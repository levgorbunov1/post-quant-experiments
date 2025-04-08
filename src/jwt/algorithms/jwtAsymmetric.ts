import crypto from "crypto";
import { base64urlEncode } from "../utils";
import type { Payload } from "../payload";

const nodeAlgs: Record<"RS256" | "RS512" | "ES256" | "EdDSA", string> = {
  RS256: "RSA-SHA256",
  RS512: "RSA-SHA512",
  ES256: "sha256",
  EdDSA: undefined as any, // Ed25519 doesn't take an algorithm string
};

export const createAsymmetricJWT = (
  payload: Payload,
  privateKey: string | Buffer,
  alg: "RS256" | "RS512" | "ES256" | "EdDSA",
) => {
  const header = { alg, typ: "JWT" };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  let signature: Buffer;
  if (alg === "EdDSA") {
    // Ed25519: sign input directly, no hashing or padding
    signature = crypto.sign(null, Buffer.from(signingInput), privateKey);
  } else {
    const nodeAlg = nodeAlgs[alg];
    if (!nodeAlg) throw new Error(`Unsupported algorithm: ${alg}`);
    signature = crypto.sign(nodeAlg, Buffer.from(signingInput), {
      key: privateKey,
      padding: alg.startsWith("RS")
        ? crypto.constants.RSA_PKCS1_PADDING
        : undefined,
    });
  }

  const encodedSignature = base64urlEncode(signature);
  const token = `${signingInput}.${encodedSignature}`;
  const size = Buffer.byteLength(token, "utf8");

  return { token, size };
};
