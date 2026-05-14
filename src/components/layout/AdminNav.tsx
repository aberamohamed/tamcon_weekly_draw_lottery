'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Zap, 
  Menu, 
  X,
  CreditCard,
  UserCircle,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const adminItems = [
  { name: 'KPI Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Transactions', href: '/admin/transactions', icon: Receipt },
  { name: 'Draw Management', href: '/admin/draws', icon: Zap },
];

export function AdminNav() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-[#2D338B]">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-xl">
          <span className="text-[#2D338B]">TAM</span>
          <span className="text-[#F7941E]">CON.</span>
        </span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {adminItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                isActive 
                  ? 'text-white' 
                  : 'text-muted-foreground hover:text-[#2D338B] hover:bg-[#2D338B]/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeAdminNav"
                  className="absolute inset-0 bg-[#2D338B] rounded-xl -z-10 shadow-lg shadow-[#2D338B]/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto space-y-2">
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-[#2D338B]/10">
              <UserCircle className="h-4 w-4 text-[#2D338B]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-[#2D338B]">{user?.fullName || 'Admin'}</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">System Administrator</p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors group"
        >
          <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 border-r bg-card flex-col fixed inset-y-0 left-0">
        <NavContent />
      </aside>

      <header className="lg:hidden h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-[#2D338B]" />
          <span className="font-bold">
            <span className="text-[#2D338B]">TAM</span>
            <span className="text-[#F7941E]">CON.</span>
          </span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
