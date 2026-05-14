'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminNav } from '@/components/layout/AdminNav';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminFooter } from '@/components/layout/AdminFooter';
import { Skeleton } from '@/components/ui/skeleton';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        {/* Skeleton Admin Header */}
        <header className="h-16 border-b bg-white fixed top-0 left-0 right-0 z-[60] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="space-y-1 hidden md:block">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </header>

        <div className="flex flex-1 pt-16">
          {/* Skeleton Admin Sidebar */}
          <aside className="hidden lg:flex w-64 border-r bg-white flex-col fixed inset-y-0 left-0 top-16 z-50 p-4 space-y-6">
            <div className="px-2 pb-4 border-b border-zinc-50">
               <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </aside>

          {/* Skeleton Admin Content */}
          <main className="flex-1 lg:pl-64 flex flex-col">
            <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
            <div className="h-14 border-t bg-white px-6 flex items-center justify-between">
               <Skeleton className="h-4 w-40" />
               <Skeleton className="h-4 w-20" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <AdminHeader />
      
      <div className="lg:hidden fixed top-[18px] left-4 z-[70]">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="text-zinc-500">
                <Menu className="h-6 w-6" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-64 border-none">
            <AdminNav />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 pt-16">
        <AdminNav />
        
        <main className="flex-1 lg:pl-64 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
          <div className="flex-1 p-1 md:p-2 w-full overflow-hidden flex flex-col">
            <div className="flex-1 bg-white rounded-xl border border-zinc-200 overflow-y-auto p-6 md:p-10">
              {children}
            </div>
          </div>
          <AdminFooter />
        </main>
      </div>
    </div>
  );
}
