export const base64urlEncode = (input: string | Uint8Array): string => {
  const data =
    typeof input === "string" ? Buffer.from(input, "utf8") : Buffer.from(input);
  return data
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};
