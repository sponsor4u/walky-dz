import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="admin-canvas" dir="rtl">
      <Sidebar />
      <main
        className="min-h-screen transition-all duration-300 mr-0 lg:mr-[260px]"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
