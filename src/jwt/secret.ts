import crypto from "crypto";
import type { SignerWithInternal } from "@noble/post-quantum/ml-dsa";
import { randomBytes } from "@noble/post-quantum/utils";

export const random32ByteBase64Encoded = crypto
  .randomBytes(32)
  .toString("base64url");

export const randomPQSSecretKey = (alg: SignerWithInternal) => {
  const seed = randomBytes(32);
  const keys = alg.keygen(seed);
  return keys.secretKey;
};

import { generateKeyPairSync } from "crypto";

// RSA 2048 for RS256
export const generateRSA256KeyPair = () =>
  generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

// RSA 4096 for RS512
export const generateRSA512KeyPair = () =>
  generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

// EC P-256 for ES256
export const generateEC256KeyPair = () =>
  generateKeyPairSync("ec", {
    namedCurve: "prime256v1",
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

// NB Not actually supported by RFC 7518,
// But is supported by Jose 🤷🏻
export const generateEd25519KeyPair = () =>
  generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
