'use server';

import { db } from '@/db';
import { offers } from '@/db/schema';
import { unstable_noStore as noStore } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function getAllOffers() {
  noStore();
  try {
    const allOffers = await db.select().from(offers).orderBy(offers.createdAt);
    return { success: true, offers: allOffers };
  } catch (error: any) {
    console.error('Failed to get offers:', error);
    return { error: 'Internal Server Error' };
  }
}

export async function createOffer(data: any) {
  try {
    const newOffer = {
      id: Math.random().toString(36).substring(2, 9), // Simple ID generation
      tag: data.tag,
      title: data.title,
      bengali: data.bengali || '',
      desc: data.desc,
      code: data.code,
      badge: data.badge,
      highlight: data.highlight || false,
    };
    
    await db.insert(offers).values(newOffer);
    return { success: true, message: 'Offer created successfully' };
  } catch (error: any) {
    console.error('Failed to create offer:', error);
    return { error: 'Failed to create offer' };
  }
}

export async function deleteOffer(id: string) {
  try {
    await db.delete(offers).where(eq(offers.id, id));
    return { success: true, message: 'Offer deleted successfully' };
  } catch (error: any) {
    console.error('Failed to delete offer:', error);
    return { error: 'Failed to delete offer' };
  }
}
