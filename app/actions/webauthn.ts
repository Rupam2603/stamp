'use server';

import { db } from '@/db';
import { users, passkeys } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type { AuthenticatorTransport } from '@simplewebauthn/server';

const rpID = process.env.NODE_ENV === 'production' ? (process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : 'localhost') : 'localhost';
const origin = process.env.NODE_ENV === 'production' ? (process.env.NEXT_PUBLIC_APP_URL || `https://${rpID}`) : `http://${rpID}:3000`;
const rpName = 'BHAAR MOSHAI';

// Generate Registration Options (when user wants to add a passkey)
export async function generateRegOptions(userId: string) {
  try {
    const userRows = await db.select().from(users).where(eq(users.id, userId));
    const user = userRows[0];

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const userPasskeys = await db.select().from(passkeys).where(eq(passkeys.userId, userId));

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(user.id),
      userName: user.email,
      excludeCredentials: userPasskeys.map((passkey: any) => ({
        id: passkey.id, // String
        type: 'public-key',
        transports: passkey.transports ? (passkey.transports.split(',') as AuthenticatorTransport[]) : [],
      })),
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'preferred',
      },
    });

    await db.update(users).set({ currentChallenge: options.challenge }).where(eq(users.id, user.id));

    return { success: true, options };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: err.message };
  }
}

export async function verifyRegResponse(userId: string, response: any) {
  try {
    const userRows = await db.select().from(users).where(eq(users.id, userId));
    const user = userRows[0];

    if (!user || !user.currentChallenge) {
      return { success: false, message: 'User or challenge not found' };
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo;
      const { id, publicKey, counter, transports } = credential;

      // publicKey is a Uint8Array, we need to convert to base64url for db
      const credentialPublicKeyBase64 = Buffer.from(publicKey).toString('base64url');

      await db.insert(passkeys).values({
        id: id, // It's already a string in simplewebauthn v10
        userId: user.id,
        publicKey: credentialPublicKeyBase64,
        counter: counter,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: transports ? transports.join(',') : '',
      });

      await db.update(users).set({ currentChallenge: null }).where(eq(users.id, user.id));

      return { success: true, verified };
    }

    return { success: false, message: 'Verification failed' };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: err.message };
  }
}

export async function generateAuthOptions(email: string) {
  try {
    const userRows = await db.select().from(users).where(eq(users.email, email));
    const user = userRows[0];

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const userPasskeys = await db.select().from(passkeys).where(eq(passkeys.userId, user.id));

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: userPasskeys.map((passkey: any) => ({
        id: passkey.id,
        type: 'public-key',
        transports: passkey.transports ? (passkey.transports.split(',') as AuthenticatorTransport[]) : [],
      })),
      userVerification: 'preferred',
    });

    // Save challenge
    await db.update(users).set({ currentChallenge: options.challenge }).where(eq(users.id, user.id));

    return { success: true, options };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: err.message };
  }
}

export async function verifyAuthResponse(email: string, response: any) {
  try {
    const userRows = await db.select().from(users).where(eq(users.email, email));
    const user = userRows[0];

    if (!user || !user.currentChallenge) {
      return { success: false, message: 'User or challenge not found' };
    }

    const passkeyRows = await db.select().from(passkeys).where(eq(passkeys.id, response.id));
    const passkey = passkeyRows[0];

    if (!passkey || passkey.userId !== user.id) {
      return { success: false, message: 'Passkey not found for user' };
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.id,
        publicKey: Buffer.from(passkey.publicKey, 'base64url'), // Convert back to Uint8Array/Buffer
        counter: Number(passkey.counter),
        transports: passkey.transports ? (passkey.transports.split(',') as AuthenticatorTransport[]) : [],
      },
    });

    const { verified, authenticationInfo } = verification;

    if (verified && authenticationInfo) {
      await db.update(passkeys).set({ counter: authenticationInfo.newCounter }).where(eq(passkeys.id, passkey.id));
      await db.update(users).set({ currentChallenge: null }).where(eq(users.id, user.id));
      
      return { success: true, verified, userId: user.id, isAdmin: user.isAdmin };
    }

    return { success: false, message: 'Authentication failed' };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: err.message };
  }
}
