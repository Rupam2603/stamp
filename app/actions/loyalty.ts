'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';

export async function getLoyaltyData(userId: string) {
  noStore();
  try {
    const user = await db.select({
      stamps: users.stamps,
      completedCards: users.completedCards,
      lastStampTime: users.lastStampTime,
      stampHistory: users.stampHistory,
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (user.length === 0) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, data: user[0] };
  } catch (error) {
    console.error('Failed to get loyalty data:', error);
    return { success: false, message: 'Failed to fetch data' };
  }
}

export async function updateLoyaltyData(userId: string, data: { stamps: number, completedCards: number, lastStampTime: number | null, stampHistory?: number[] }) {
  try {
    const updatePayload: any = {
      stamps: data.stamps,
      completedCards: data.completedCards,
      lastStampTime: data.lastStampTime
    };

    if (data.stampHistory !== undefined) {
      updatePayload.stampHistory = data.stampHistory;
    }

    await db.update(users)
      .set(updatePayload)
      .where(eq(users.id, userId));
      
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to update loyalty data:', error);
    return { success: false, message: 'Failed to update data' };
  }
}
