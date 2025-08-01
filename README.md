## Sketches with Post Quantum Crypto

### Get a table

```bash
npm start
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

### Which algorithm should I use?

| Algorithm  | JWT byte length | Type                | Keygen time | Sign time | Verify time | Total time |
| ---------- | --------------- | ------------------- | ----------- | --------- | ----------- | ---------- |
| HS256      | 172 Bytes       | Pre-Q \| Symmetric  | N/A         | 0.13 ms   | 0.13 ms     | 0.26 ms    |
| RS256      | 471 Bytes       | Pre-Q \| Asymmetric | 1090.39 ms  | 0.94 ms   | 0.15 ms     | 1091.48 ms |
| RS512      | 812 Bytes       | Pre-Q \| Asymmetric | 620.8 ms    | 2.65 ms   | 0.11 ms     | 623.56 ms  |
| ES256      | 225 Bytes       | Pre-Q \| Asymmetric | 811.6 ms    | 0.24 ms   | 0.10 ms     | 811.94 ms  |
| EdDSA      | 215 Bytes       | Pre-Q \| Asymmetric | 1423.3 ms   | 0.32 ms   | 0.09 ms     | 1423.71 ms |
| Dilithium2 | 3363 Bytes      | PQS \| Asymmetric   | 1.03 ms     | 0.53 ms   | 0.31 ms     | 1.87 ms    |
| Dilithium3 | 4527 Bytes      | PQS \| Asymmetric   | 1.46 ms     | 0.85 ms   | 0.25 ms     | 2.56 ms    |
| Dilithium5 | 6263 Bytes      | PQS \| Asymmetric   | 1.25 ms     | 0.76 ms   | 0.40 ms     | 2.41 ms    |
| Falcon512  | 1014 Bytes      | PQS \| Asymmetric   | 12.31 ms    | 4.62 ms   | 0.12 ms     | 17.05 ms   |
| Falcon1024 | 1839 Bytes      | PQS \| Asymmetric   | 20.53 ms    | 8.78 ms   | 0.21 ms     | 29.52 ms   |

### What's the back of the envalope conclusion

Falcon looks promising and has a smaller token size than Dilithium. Token size is important because of the 8k character limit on URLs, or the 4kb cookie limit.

In terms of token generation speed, PQC algorithms seem to outperform pre-quantum algorithms, with the greatest difference coming from the key generation time. Out of the PQC algorithms, Dilithium is significantly faster than Falcon.

We might be interested in a forward look in this area and ask if there are implications for the use of JWTs.

test test