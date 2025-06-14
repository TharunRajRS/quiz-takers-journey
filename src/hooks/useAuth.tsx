
import { useState } from 'react';

export const useAuth = () => {
  const [user] = useState({ id: 'demo-user', email: 'demo@example.com' });
  const [session] = useState({ user: { id: 'demo-user', email: 'demo@example.com' } });
  const [loading] = useState(false);

  const signOut = () => {
    // No actual sign out needed for demo mode
    window.location.href = '/';
  };

  return {
    user,
    session,
    loading,
    signOut,
  };
};
