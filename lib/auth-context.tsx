'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState
} from 'react';
import { NeonAuthUIProvider } from '@neondatabase/auth-ui';
import '@neondatabase/auth-ui/css';
import { authClient } from './auth/client';
import { getSessionAction } from '@/app/actions/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  stamps?: number;
  completedCards?: number;
  lastStampTime?: number | null;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  const refreshUser = async () => {
    if (session.data?.user) {
      try {
        const u = await getSessionAction();
        setDbUser(u as any);
      } catch(e) {
        console.error(e);
      }
    } else {
      setDbUser(null);
    }
    setIsDbLoaded(true);
  };

  useEffect(() => {
    if (!session.isPending) {
      refreshUser();
    }
  }, [session.isPending, session.data?.user?.id]);

  const signOut = async () => {
    await authClient.signOut();
    setDbUser(null);
    window.location.href = '/';
  };

  return (
    <NeonAuthUIProvider authClient={authClient} redirectTo="/activate">
      <AuthContext.Provider
        value={{
          user: dbUser,
          isLoaded: !session.isPending && isDbLoaded,
          isSignedIn: !!dbUser,
          signOut,
          refreshUser
        }}
      >
        {children}
      </AuthContext.Provider>
    </NeonAuthUIProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
