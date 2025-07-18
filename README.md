## Sketches with Post Quantum Crypto

### Get a table

run:
```bash
npm start
```

to get:

```
┌─────────┬──────────────┬─────────────────┬──────────────────────┐
│ (index) │ Algorithm    │ JWT byte length │ Type                 │
├─────────┼──────────────┼─────────────────┼──────────────────────┤
│ 0       │ 'HS256'      │ '172 Bytes'     │ 'Pre-Q | Symmetric'  │
│ 1       │ 'RS256'      │ '471 Bytes'     │ 'Pre-Q | Asymmetric' │
│ 2       │ 'RS512'      │ '812 Bytes'     │ 'Pre-Q | Asymmetric' │
│ 3       │ 'ES256'      │ '225 Bytes'     │ 'Pre-Q | Asymmetric' │
│ 4       │ 'EdDSA'      │ '215 Bytes'     │ 'Pre-Q | Asymmetric' │
│ 5       │ 'Dilithium2' │ '3363 Bytes'    │ 'PQS | Asymmetric'   │
│ 6       │ 'Dilithium3' │ '4527 Bytes'    │ 'PQS | Asymmetric'   │
│ 7       │ 'Dilithium5' │ '6263 Bytes'    │ 'PQS | Asymmetric'   │
│ 8       │ 'Falcon512'  │ '1013 Bytes'    │ 'PQS | Asymmetric'   │
│ 9       │ 'Falcon1024' │ '1838 Bytes'    │ 'PQS | Asymmetric'   │
└─────────┴──────────────┴─────────────────┴──────────────────────┘
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
