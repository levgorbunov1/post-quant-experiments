const algorithms = ["ML-DSA-44", "ML-DSA-65", "ML-DSA-87"] as const;
export type DilithiumAlgorithms = (typeof algorithms)[number];
