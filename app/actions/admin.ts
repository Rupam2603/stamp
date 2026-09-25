'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { getSessionAction } from './auth';

export async function getAllUsers() {
  try {
    const sessionUser = await getSessionAction();
    if (!sessionUser || !sessionUser.isAdmin) return { error: 'Unauthorized' };

    const allUsers = await db.select().from(users);
    return { success: true, users: allUsers };
  } catch (error: any) {
    console.error('Failed to get all users:', error);
    return { error: 'Internal Server Error' };
  }
}
