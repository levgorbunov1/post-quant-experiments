## Sketches with Post Quantum Crypto

### Get a table

run:
```bash
npm start
```

to get:

```
┌─────────┬──────────────┬─────────────────┬──────────────────────┬─────────────┬───────────┬─────────────┬─────────────┐
│ (index) │ Algorithm    │ JWT byte length │ Type                 │ Keygen time │ Sign time │ Verify time │ Total time  │
├─────────┼──────────────┼─────────────────┼──────────────────────┼─────────────┼───────────┼─────────────┼─────────────┤
│ 0       │ 'HS256'      │ '172 Bytes'     │ 'Pre-Q | Symmetric'  │ 'N/A'       │ '0.13ms'  │ '0.13ms'    │ '0.26ms'    │
│ 1       │ 'RS256'      │ '471 Bytes'     │ 'Pre-Q | Asymmetric' │ '1090.39ms' │ '0.94ms'  │ '0.15ms'    │ '1091.48ms' │
│ 2       │ 'RS512'      │ '812 Bytes'     │ 'Pre-Q | Asymmetric' │ '620.8ms'   │ '2.65ms'  │ '0.11ms'    │ '623.56ms'  │
│ 3       │ 'ES256'      │ '225 Bytes'     │ 'Pre-Q | Asymmetric' │ '811.6ms'   │ '0.24ms'  │ '0.1ms'     │ '811.94ms'  │
│ 4       │ 'EdDSA'      │ '215 Bytes'     │ 'Pre-Q | Asymmetric' │ '1423.3ms'  │ '0.32ms'  │ '0.09ms'    │ '1423.71ms' │
│ 5       │ 'Dilithium2' │ '3363 Bytes'    │ 'PQS | Asymmetric'   │ '1.03ms'    │ '0.53ms'  │ '0.31ms'    │ '1.87ms'    │
│ 6       │ 'Dilithium3' │ '4527 Bytes'    │ 'PQS | Asymmetric'   │ '1.46ms'    │ '0.85ms'  │ '0.25ms'    │ '2.56ms'    │
│ 7       │ 'Dilithium5' │ '6263 Bytes'    │ 'PQS | Asymmetric'   │ '1.25ms'    │ '0.76ms'  │ '0.4ms'     │ '2.41ms'    │
│ 8       │ 'Falcon512'  │ '1014 Bytes'    │ 'PQS | Asymmetric'   │ '12.31ms'   │ '4.62ms'  │ '0.12ms'    │ '17.05ms'   │
│ 9       │ 'Falcon1024' │ '1839 Bytes'    │ 'PQS | Asymmetric'   │ '20.53ms'   │ '8.78ms'  │ '0.21ms'    │ '29.52ms'   │
└─────────┴──────────────┴─────────────────┴──────────────────────┴─────────────┴───────────┴─────────────┴─────────────┘
```

### What is this?

One of the Lead devs heard that some of the Post-Quantum safe candidates were:

1. Slow
2. Chunky

So this is a quick test to poke and prod some assumptions there and get a sense of what a PQS
world might look like in JWTs, which are pretty widely used as trusted places to exchange data.

### What did I find

We're looking to NIST via NCSC for candidates here.
The conclusions I came to is, that future is [lattice based](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf).
And that there are [four main candidate algorithms](https://www.nist.gov/news-events/news/2022/07/nist-announces-first-four-quantum-resistant-cryptographic-algorithms).

  - [CRYSTALS-Kyber](https://pq-crystals.org/kyber/index.shtml)
  - [CRYSTALS-Dilithium](https://pq-crystals.org/dilithium/index.shtml)
  - [FALCON](https://falcon-sign.info/)
  - [SPHINCS+](https://sphincs.org/)

Of these Kyber is for encryption, we're looking at signing and verification here.
SPHINCS+ is really big, and cited by NIST as one to treat as a fallback.

There's also falcon, which seems to have a far far better sig size.

We use this library here: https://github.com/Dashlane/pqc.js/

### What's the back of the envalope conclusion

Falcon looks promising and has a smaller token size than Dilithium. Token size is important because of the 8k character limit on URLs, or the 4kb cookie limit.

We might be interested in a forward look in that area and ask if there are implications for the use of JWTs.
