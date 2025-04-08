export interface Payload {
  sub: string;
  name: string;
  admin: boolean;
  iat: number;
}

export const payload: Payload = {
  sub: "1234567890",
  name: "John Doe",
  admin: true,
  iat: Math.floor(Date.now() / 1000),
};
