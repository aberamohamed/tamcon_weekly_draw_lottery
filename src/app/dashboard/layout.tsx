'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect only if authenticated and NOT a customer (to admin)
    if (!isLoading && isAuthenticated && user?.role !== 'customer') {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
        <aside className="w-64 border-r bg-white dark:bg-zinc-900 p-6 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </aside>
        <main className="flex-1 p-8 space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  // No longer blocking the entire layout if not authenticated
  // but still enforcing admin/customer separation if user exists
  if (!isLoading && user && user.role !== 'customer') return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DashboardNav />
      <main className="lg:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
