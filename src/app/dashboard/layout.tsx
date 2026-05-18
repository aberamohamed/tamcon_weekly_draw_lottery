'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { DashboardFooter } from '@/components/layout/DashboardFooter';
import { Skeleton } from '@/components/ui/skeleton';
import { Menu, Search, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function DashboardLayout({
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
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        {/* Skeleton Header */}
        <header className="h-16 border-b bg-white fixed top-0 left-0 right-0 z-[60] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-24 hidden md:block" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="space-y-1 hidden md:block">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-16" />
              </div>
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </header>

        <div className="flex flex-1 pt-16">
          {/* Skeleton Sidebar */}
          <aside className="hidden lg:flex w-64 border-r bg-white flex-col fixed inset-y-0 left-0 top-16 z-50 p-4 space-y-6">
            <div className="px-2 pb-4 border-b border-zinc-50">
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </aside>

          {/* Skeleton Content */}
          <main className="flex-1 lg:pl-64 flex flex-col">
            <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
              <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="h-14 border-t bg-white px-6 flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) return null;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <DashboardHeader />

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
            <DashboardNav />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 pt-16">
        <DashboardNav />

        <main className="flex-1 lg:pl-64 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
          <div className="flex-1 p-1 md:p-2 w-full overflow-hidden flex flex-col">
            <div className="flex-1 bg-white rounded-xl border border-zinc-200 overflow-y-auto p-6 md:p-10">
              {children}
            </div>
          </div>
          <DashboardFooter />
        </main>
      </div>
    </div>
  );
}
