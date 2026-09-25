import { jwtVerify, createRemoteJWKSet } from 'jose';
import { cookies } from 'next/headers';

const jwksUrl = new URL(process.env.NEXT_PUBLIC_NEON_JWKS_URL || "");
const JWKS = createRemoteJWKSet(jwksUrl);

export async function getSession() {
  try {
    const cookieStore = await cookies();
    // Better Auth default cookie name is better-auth.session_token
    const sessionToken = cookieStore.get('better-auth.session_token')?.value || cookieStore.get('neon_auth_session')?.value;
    
    if (!sessionToken) return null;

    const { payload } = await jwtVerify(sessionToken, JWKS, {
      algorithms: ['RS256'],
    });

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    console.error("Error getting/verifying Neon Auth session JWT:", error);
    return null;
  }
}
