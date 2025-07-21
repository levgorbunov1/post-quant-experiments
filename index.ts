// test.js
import { createHS256JWT } from "./src/jwt/algorithms/jwtSymmetric";
import { createPQCJWT } from "./src/jwt/algorithms/jwtAsymmetricPQS";
import { payload } from "./src/jwt/payload";
import { random32ByteBase64Encoded } from "./src/jwt/secret";
import { createAsymmetricJWT } from "./src/jwt/algorithms/jwtAsymmetric";
import type { PQCAlgorithm } from "./src/jwt/algorithms/types";
import {
  generateRSA256KeyPair,
  generateRSA512KeyPair,
  generateEC256KeyPair,
  generateEd25519KeyPair,
} from "./src/jwt/secret";
import { syncBenchmark } from "./src/benchmark";

const hs256Results = createHS256JWT(payload, random32ByteBase64Encoded);

const jwtAssymAlgorithmns = ["RS256", "RS512", "ES256", "EdDSA"] as const;

const getAsymKeyGenImpl = (alg: typeof jwtAssymAlgorithmns[number]) => {
  const map = {
    "RS256": generateRSA256KeyPair(),
    "RS512": generateRSA512KeyPair(),
    "ES256": generateEC256KeyPair(),
    "EdDSA": generateEd25519KeyPair(),
  } satisfies Record<string, unknown>;

  return map[alg];
};
 
const jwtAssymResults = jwtAssymAlgorithmns.map((alg) => {
  const { result: { privateKey, publicKey }, time: keygen_time }  = syncBenchmark(`Generating keys with ${alg}`, () => getAsymKeyGenImpl(alg));

  const algResults = createAsymmetricJWT(payload, { privateKey: privateKey as string, publicKey: publicKey as string }, alg as any);

  return {
    Algorithm: alg,
    "JWT byte length": `${algResults.size} Bytes`,
    Type: "Pre-Q | Asymmetric",
    "Keygen time": `${keygen_time}ms`,
    "Sign time": `${algResults.time.sign_time}ms`,
    "Verify time": `${algResults.time.verify_time}ms`,
    "Total time": `${Number((keygen_time + algResults.time.sign_time + algResults.time.verify_time).toFixed(2))}ms`
  };
});

const PQCAlgorithmns: PQCAlgorithm[] = [
  "Dilithium2",
  "Dilithium3",
  "Dilithium5",
  "Falcon512",
  "Falcon1024"
];

const PQCResults = Promise.all(
  PQCAlgorithmns.map(async (alg) => {
    const algResults = await createPQCJWT(payload, alg);

    return {
      Algorithm: alg,
      "JWT byte length": `${algResults.size} Bytes`,
      Type: "PQS | Asymmetric",
      "Keygen time": `${algResults.time.keygen_time}ms`,
      "Sign time": `${algResults.time.sign_time}ms`,
      "Verify time": `${algResults.time.verify_time}ms`,
      "Total time": `${algResults.time.total_time}ms`
    };
  })
);

PQCResults.then((data) => { 
  const results = [
  {
    Algorithm: "HS256",
    "JWT byte length": `${hs256Results.size} Bytes`,
    Type: "Pre-Q | Symmetric",
    "Keygen time": "N/A",
    "Sign time": `${hs256Results.time.sign_time}ms`,
    "Verify time": `${hs256Results.time.verify_time}ms`,
    "Total time": `${hs256Results.time.total_time}ms`
  },
  ...jwtAssymResults,
  ...data,
];

console.table(results);
});
