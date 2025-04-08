// test.js
import { createHS256JWT } from "./src/jwt/algorithms/jwtSymmetric";
import { createFIPS204JWT } from "./src/jwt/algorithms/jwtAsymmetricPQS";
import { payload } from "./src/jwt/payload";
import { random32ByteBase64Encoded } from "./src/jwt/secret";
import { createAsymmetricJWT } from "./src/jwt/algorithms/jwtAsymmetric";
import type { DilithiumAlgorithms } from "./src/jwt/algorithms/types";
import {
  generateRSA256KeyPair,
  generateRSA512KeyPair,
  generateEC256KeyPair,
  generateEd25519KeyPair,
} from "./src/jwt/secret";

const dilithiumAlgorithmns: DilithiumAlgorithms[] = [
  "ML-DSA-44",
  "ML-DSA-65",
  "ML-DSA-87",
];

const dilithiumResults = dilithiumAlgorithmns.map((alg) => {
  const algResults = createFIPS204JWT(payload, alg);
  return {
    Algorithm: alg,
    "JWT byte length": `${algResults.size} Bytes`,
    Type: "PQS | Asymmetric",
  };
});

const hs256Results = createHS256JWT(payload, random32ByteBase64Encoded);

const rsa256 = generateRSA256KeyPair();
const rsa512 = generateRSA512KeyPair();
const ec256 = generateEC256KeyPair();
const ed25519 = generateEd25519KeyPair();

const jwtAssymResults = [
  ["RS256", rsa256.privateKey],
  ["RS512", rsa512.privateKey],
  ["ES256", ec256.privateKey],
  ["EdDSA", ed25519.privateKey],
].map(([alg, key]) => {
  const { size } = createAsymmetricJWT(payload, key as string, alg as any);
  return {
    Algorithm: alg,
    "JWT byte length": `${size} Bytes`,
    Type: "Pre-Q | Asymmetric",
  };
});

const results = [
  {
    Algorithm: "HS256",
    "JWT byte length": `${hs256Results.size} Bytes`,
    Type: "Pre-Q | Symmetric",
  },
  ...jwtAssymResults,
  ...dilithiumResults,
];

console.table(results);
