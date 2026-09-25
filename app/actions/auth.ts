'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function getSessionAction() {
  const neonSession = await getSession();
  if (!neonSession) return null;

  // We have a valid neon session. Check if user exists in our DB.
  let [dbUser] = await db.select().from(users).where(eq(users.email, neonSession.email)).limit(1);

  if (!dbUser) {
    // If they just signed up via Neon Auth, we need to create them in our DB.
    const isAdmin = neonSession.email.toLowerCase() === 'bhar@gmail.com';
    const [newUser] = await db.insert(users).values({
      id: neonSession.id,
      email: neonSession.email,
      name: neonSession.name || neonSession.email.split('@')[0],
      passwordHash: '', // Handled by Neon Auth
      isAdmin,
      stamps: 0,
      completedCards: 0,
      lastStampTime: null,
    }).returning();
    
    dbUser = newUser;
  }

  return dbUser;
}

export async function signOutAction() {
  // Since we rely on neon auth, signOut should actually be called from the client using authClient.signOut()
  // But we can clear our local cookies if any
  return { success: true };
}
