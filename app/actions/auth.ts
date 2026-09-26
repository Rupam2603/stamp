'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required.' };
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    // Insert user into the database
    await db.insert(users).values({
      id,
      name,
      email,
      passwordHash,
    });

    return { success: true, message: 'Account created successfully!', userId: id, isAdmin: false };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, message: error.message || 'Failed to create account.' };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    // Check if user exists
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user.length === 0) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user[0].passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // In a real application, you would set a session cookie here or return a JWT
    // For now, we will just return success

    return { success: true, message: 'Logged in successfully!', userId: user[0].id, isAdmin: user[0].isAdmin };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, message: error.message || 'Failed to log in.' };
  }
}
