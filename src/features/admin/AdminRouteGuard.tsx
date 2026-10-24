import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { subscribeToAuthState, verifyAdminStatus } from '../../lib/auth';
import type { User } from 'firebase/auth';

export const AdminRouteGuard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      setCurrentUser(user);
      if (user) {
        const authorized = await verifyAdminStatus(user);
        setIsAdmin(authorized);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-slate-800">
        <div className="w-10 h-10 border-4 border-sky-500/20 border-t-[#0284c7] rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-medium">যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet context={{ currentUser }} />;
};
