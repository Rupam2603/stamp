import { auth } from '@/lib/auth/server';

export async function getSession() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) return null;

    return {
      id: session.user.id as string,
      email: session.user.email as string,
      name: (session.user.name as string) || '',
    };
  } catch (error) {
    console.error('Error getting Neon Auth session:', error);
    return null;
  }
}
