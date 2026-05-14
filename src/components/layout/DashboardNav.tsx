'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Trophy, 
  Wallet, 
  Ticket, 
  History, 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard,
  User,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Tickets', href: '/dashboard/tickets', icon: Ticket },
  { name: 'Draw Results', href: '/dashboard/results', icon: Trophy },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <Trophy className="h-6 w-6 text-[#2D338B]" />
          <span>
            <span className="text-[#2D338B]">TAM</span>
            <span className="text-[#F7941E]">CON.</span>
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
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
                  layoutId="activeNav"
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
            <div className="p-2 rounded-lg bg-[#F7941E]/10">
              <User className="h-4 w-4 text-[#F7941E]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-[#2D338B]">{user?.fullName || 'Customer'}</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Verified Account</p>
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-card flex-col fixed inset-y-0 left-0">
        <NavContent />
      </aside>

      {/* Mobile Nav */}
      <header className="lg:hidden h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <Trophy className="h-6 w-6 text-primary" />
          <span>Tamcon</span>
        </Link>
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
