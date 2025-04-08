## Sketches with Post Quantum Crypto

### Get a table

run:
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

There's also falcon, [which hasn't yet been implimented in noble](https://github.com/paulmillr/noble-post-quantum/issues/10) but seems to have a far far better sig size.

Here's an interesting chart [from @nobel's repo](https://github.com/paulmillr/noble-post-quantum/blob/main/README.md#what-should-i-use)

### What should I use?

|         | Speed  | Key size    | Sig size    | Created in | Popularized in | Post-quantum? |
| ------- | ------ | ----------- | ----------- | ---------- | -------------- | ------------- |
| RSA     | Normal | 256B - 2KB  | 256B - 2KB  | 1970s      | 1990s          | No            |
| ECC     | Normal | 32 - 256B   | 48 - 128B   | 1980s      | 2010s          | No            |
| ML-KEM  | Fast   | 1.6 - 31KB  | 1KB         | 1990s      | 2020s          | Yes           |
| ML-DSA  | Normal | 1.3 - 2.5KB | 2.5 - 4.5KB | 1990s      | 2020s          | Yes           |
| SLH-DSA | Slow   | 32 - 128B   | 17 - 50KB   | 1970s      | 2020s          | Yes           |
| FN-DSA  | Slow   | 0.9 - 1.8KB | 0.6 - 1.2KB | 1990s      | 2020s          | Yes           |

### What's the back of the envalope conclusion

CRYSTALS-Dilithium / ML-DSA looks promising, but the signature is big.
This is going to risk the 8k character limit norm on URLs, or the [4kb cookie limit](http://browsercookielimits.iain.guru/).

We might be interested in a forward look in that area and ask if there are implications for the use of JWTs
