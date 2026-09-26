import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from './db/index';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const email = 'bhar@gmail.com';
  const password = 'Bhar@2026';

  const existingAdmin = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existingAdmin.length > 0) {
    if (!existingAdmin[0].isAdmin) {
      await db.update(users).set({ isAdmin: true }).where(eq(users.email, email));
      console.log('User exists, updated to admin.');
    } else {
      console.log('Admin already exists!');
    }
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    await db.insert(users).values({
      id,
      name: 'Admin',
      email,
      passwordHash,
      isAdmin: true,
    });
    console.log('Admin created successfully in Neon database!');
  }
  process.exit();
}

createAdmin();
