'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionAction } from './auth';

export async function updateLoyaltyData(stamps: number, completedCards: number, lastStampTime: number | null) {
  try {
    const sessionUser = await getSessionAction();
    if (!sessionUser) return { error: 'Unauthorized' };

    await db.update(users).set({
      stamps,
      completedCards,
      lastStampTime,
    }).where(eq(users.id, sessionUser.id));

    return { success: true };
  } catch (error: any) {
    console.error('Failed to update loyalty data:', error);
    return { error: 'Internal Server Error' };
  }
}
