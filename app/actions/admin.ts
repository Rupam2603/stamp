'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { unstable_noStore as noStore } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function getAllUsers() {
  noStore();
  try {
    const allUsers = await db.select().from(users).where(eq(users.isAdmin, false));
    return { success: true, users: allUsers };
  } catch (error: any) {
    console.error('Failed to get all users:', error);
    return { error: 'Internal Server Error' };
  }
}
