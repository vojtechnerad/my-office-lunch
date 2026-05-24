import { SignJWT, jwtVerify } from 'jose';
import { env } from '../env';

const secret = new TextEncoder().encode(env.JWT_SECRET);

export type JwtPayload = {
  sub: string;
  role: string;
};

export async function signJwt(payload: JwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret);
}

export async function verifyJwt(token: string) {
  const result = await jwtVerify(token, secret);

  return result.payload as JwtPayload;
}
