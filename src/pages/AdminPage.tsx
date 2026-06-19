import { useState, useEffect } from 'react';
import { AdminLogin } from '../components/AdminLogin';
import { AdminDashboard } from '../components/AdminDashboard';

export function AdminPage() {
  const [token, setToken] = useState<string | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (password: string) => {
    localStorage.setItem('admin_token', password);
    setToken(password);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  return token ? (
    <AdminDashboard token={token} onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}
