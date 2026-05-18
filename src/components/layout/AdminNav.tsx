'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  LayoutDashboard,
  Calendar,
  CreditCard,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Manage Draws', href: '/admin/draws', icon: Calendar },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-white flex-col fixed inset-y-0 left-0 top-16 z-50">
        <div className="flex flex-col h-full bg-white">
          {/* Search Bar */}
          <div className="px-4 pt-6 pb-4 border-b border-zinc-50">
            <div className="relative group">
              <Input
                placeholder="Search resources..."
                className="h-10 pl-4 pr-10 bg-zinc-50 border-zinc-100 rounded-lg focus:ring-1 focus:ring-[#2D338B] transition-all"
              />
              <div className="absolute right-1 top-1 bottom-1 w-8 bg-[#2D338B] rounded-md flex items-center justify-center text-white cursor-pointer hover:bg-[#2D338B]/90 transition-colors">
                <Search className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center justify-between p-1.5 rounded-xl transition-all group overflow-hidden",
                    isActive
                      ? "bg-[#2D338B] text-white"
                      : "text-zinc-500 hover:text-[#2D338B] hover:bg-zinc-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all border",
                      isActive
                        ? "bg-white/10 border-white/20"
                        : "bg-zinc-100 border-transparent group-hover:bg-white group-hover:border-zinc-200"
                    )}>
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-white" : "text-zinc-400 group-hover:text-[#2D338B]"
                      )} />
                    </div>
                    <span className={cn(
                      "text-sm font-bold transition-colors",
                      isActive ? "text-white" : "text-zinc-500 group-hover:text-[#2D338B]"
                    )}>
                      {item.name}
                    </span>
                  </div>

                  <ChevronRight className={cn(
                    "h-4 w-4 transition-all",
                    isActive ? "text-white/70" : "text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                  )} />
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile handling moved to layout */}
    </>
  );
}
