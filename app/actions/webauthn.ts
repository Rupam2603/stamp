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
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/types';

const rpID = process.env.NODE_ENV === 'production' ? (process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : 'localhost') : 'localhost';
const origin = process.env.NODE_ENV === 'production' ? (process.env.NEXT_PUBLIC_APP_URL || `https://${rpID}`) : `http://${rpID}:3000`;
const rpName = 'BHAAR MOSHAI';

// Generate Registration Options (when user wants to add a passkey)
export async function generateRegOptions(userId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const userPasskeys = await db.query.passkeys.findMany({
      where: eq(passkeys.userId, userId),
    });

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: Buffer.from(user.id, 'utf8'),
      userName: user.email,
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: Buffer.from(passkey.id, 'base64url'),
        type: 'public-key',
        transports: passkey.transports ? (passkey.transports.split(',') as AuthenticatorTransportFuture[]) : [],
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

export async function verifyRegResponse(userId: string, response: RegistrationResponseJSON) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

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
      const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } = registrationInfo;

      const credentialIDBase64 = Buffer.from(credentialID).toString('base64url');
      const credentialPublicKeyBase64 = Buffer.from(credentialPublicKey).toString('base64url');

      await db.insert(passkeys).values({
        id: credentialIDBase64,
        userId: user.id,
        publicKey: credentialPublicKeyBase64,
        counter: counter,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: response.response.transports ? response.response.transports.join(',') : '',
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
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const userPasskeys = await db.query.passkeys.findMany({
      where: eq(passkeys.userId, user.id),
    });

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: userPasskeys.map((passkey) => ({
        id: Buffer.from(passkey.id, 'base64url'),
        type: 'public-key',
        transports: passkey.transports ? (passkey.transports.split(',') as AuthenticatorTransportFuture[]) : [],
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

export async function verifyAuthResponse(email: string, response: AuthenticationResponseJSON) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.currentChallenge) {
      return { success: false, message: 'User or challenge not found' };
    }

    const passkey = await db.query.passkeys.findFirst({
      where: eq(passkeys.id, response.id),
    });

    if (!passkey || passkey.userId !== user.id) {
      return { success: false, message: 'Passkey not found for user' };
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(passkey.id, 'base64url'),
        credentialPublicKey: Buffer.from(passkey.publicKey, 'base64url'),
        counter: Number(passkey.counter),
        transports: passkey.transports ? (passkey.transports.split(',') as AuthenticatorTransportFuture[]) : [],
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
