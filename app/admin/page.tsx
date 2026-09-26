'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAllUsers } from '@/app/actions/admin';
import { Users, Award, ShieldAlert, RefreshCw } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  stamps: number;
  completedCards: number;
  createdAt: string;
  stampHistory?: number[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUsers = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setIsRefreshing(true);
    try {
      const res = await getAllUsers();
      if (res.success && res.users) {
        const usersData = res.users.map(u => ({
          ...u,
          createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString()
        }));
        // sort by creation date
        usersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUsersList(usersData as UserData[]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      if (showLoading) setIsLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    // Check if the user is an admin
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/login');
      return;
    }

    fetchUsers(true);

    // Poll every 5 seconds for real-time updates
    const intervalId = setInterval(() => {
      fetchUsers(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [router]);



  if (isLoading) {
    return (
      <main className="main-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="main-section animate-fade-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
          <p className="section-desc" style={{ marginTop: '8px' }}>Manage users and loyalty points.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => fetchUsers(false)} 
            className="btn btn-secondary" 
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin-anim' : ''} /> Refresh
          </button>

        </div>
      </div>
      <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-medium)', background: 'var(--bg-surface)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--accent-terracotta)" /> Registered Users ({usersList.length})
          </h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Email</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Stamps</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Completed Cards</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Stamp History</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-medium)', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td style={{ padding: '16px 24px' }}>
                    {user.isAdmin ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#ffebee', color: '#c62828', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>
                        <ShieldAlert size={14} /> Admin
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500 }}>
                        Customer
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={16} color="var(--accent-terracotta)" />
                      <span style={{ fontWeight: 600 }}>{user.stamps} / 3</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{user.completedCards}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {user.stampHistory && user.stampHistory.length > 0 ? (
                      <details style={{ cursor: 'pointer' }}>
                        <summary style={{ fontWeight: 600, color: 'var(--accent-terracotta)', outline: 'none', userSelect: 'none' }}>
                          View Stamps ({Math.min(3, user.stampHistory.length)})
                        </summary>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                          {user.stampHistory.slice(-3).map((timestamp, idx) => (
                            <span key={idx} style={{ background: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                              <strong>Stamp {idx + 1}:</strong> {new Date(timestamp).toLocaleString()}
                            </span>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)' }}>No history</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {usersList.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No users found in the database.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
