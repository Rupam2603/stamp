'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { getAllUsers } from '@/app/actions/admin';

interface UserData {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  stamps: number;
  completedCards: number;
  createdAt: string;
}

export default function Admin() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push('/sign-in');
      } else if (user.email !== 'bhar@gmail.com') {
        router.push('/loyalty');
      } else {
        // Fetch all users
        fetchUsers();
      }
    }
  }, [user, isLoaded, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.success && res.users) {
        const usersData = res.users.map(u => ({
          ...u,
          createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString()
        }));
        // sort by creation date
        usersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUsers(usersData);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || (user && user.email !== 'bhar@gmail.com')) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading or unauthorized...</div>;
  }

  return (
    <main className="main-section" style={{ maxWidth: '900px' }}>
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#1c202d', border: '1px solid var(--border-highlight)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src="/logo.png"
              alt="BHAAR MOSHAI Logo"
              width={34}
              height={34}
            />
          </div>
          <div>
            <span className="section-label" style={{ margin: 0 }}>ADMIN DASHBOARD</span>
            <h1 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}>
              Customers & Loyalty Stats
            </h1>
          </div>
        </div>
      </div>

      <div className="panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>Registered Users</h2>
          <button 
            onClick={fetchUsers} 
            className="btn-primary" 
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Loading user data...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.85rem' }}>Name</th>
                  <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.85rem' }}>Email</th>
                  <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.85rem' }}>Current Stamps</th>
                  <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.85rem' }}>Free Cups Redeemed</th>
                  <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.85rem' }}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No users found</td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', color: 'white' }}>{u.name || '-'} {u.isAdmin ? '(Admin)' : ''}</td>
                      <td style={{ padding: '12px', color: '#cbd5e1' }}>{u.email}</td>
                      <td style={{ padding: '12px', color: '#f59e0b', fontWeight: 'bold' }}>{u.stamps} / 3</td>
                      <td style={{ padding: '12px', color: '#4ade80', fontWeight: 'bold' }}>{u.completedCards}</td>
                      <td style={{ padding: '12px', color: '#94a3b8', fontSize: '0.8rem' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
