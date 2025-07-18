import D2 from "@dashlane/pqc-sign-dilithium2-node";
import D3 from "@dashlane/pqc-sign-dilithium3-node";
import D5 from "@dashlane/pqc-sign-dilithium5-node";
import F512 from "@dashlane/pqc-sign-falcon-512-node";
import F1024 from "@dashlane/pqc-sign-falcon-1024-node";

import { base64urlEncode } from "../utils";
import type { Payload } from "../payload";
import type { PQCAlgorithm } from "./types";

const getPQCImpl = (alg: PQCAlgorithm) => {
  const map = {
    "Dilithium2": D2,
    "Dilithium3": D3,
    "Dilithium5": D5,
    "Falcon512": F512,
    "Falcon1024": F1024,
  } satisfies Record<PQCAlgorithm, unknown>;

  return map[alg];
};

export const createPQCJWT = async (
  payload: Payload,
  alg: PQCAlgorithm
) => {
  const header = { alg, typ: "JWT" };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const msg = new TextEncoder().encode(signingInput);
  const impl = await getPQCImpl(alg)()
  const { publicKey, privateKey } = await impl.keypair();
  const { signature } = await impl.sign(msg, privateKey);

  const encodedSig = base64urlEncode(signature);
  const token = `${signingInput}.${encodedSig}`;
  const size = Buffer.byteLength(token, "utf8");

  return { token, size };
};

