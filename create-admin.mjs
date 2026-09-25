import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import dotenv from 'dotenv';

const envConfig = dotenv.parse(fs.readFileSync('.env.local'))
for (const k in envConfig) {
  process.env[k] = envConfig[k]
}

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  try {
    const cred = await createUserWithEmailAndPassword(auth, 'bhar@gmail.com', 'bhar@2026');
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: 'bhar@gmail.com',
      displayName: 'Admin Bhar',
      role: 'admin',
      stamps: 0,
      totalStamps: 3,
      completedCards: 0,
      createdAt: new Date().toISOString(),
    });
    console.log("Admin created successfully!");
  } catch(e) {
    if (e.code === 'auth/email-already-in-use') {
      console.log("Admin already exists!");
    } else {
      console.error(e);
    }
  }
  process.exit();
}

createAdmin();
