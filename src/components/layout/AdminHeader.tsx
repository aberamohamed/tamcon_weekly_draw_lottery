'use client';

import { useAuth } from '@/context/AuthContext';
import { 
  Bell, 
  Search, 
  Shield, 
  ChevronDown,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export function AdminHeader() {
  const { user } = useAuth();

  const displayName = user?.fullName || 'Abera M.';
  const initials = 'AM';

  return (
    <header className="h-16 border-b bg-white fixed top-0 left-0 right-0 z-[60] px-4 md:px-6 flex items-center justify-between">
      {/* Left: Brand */}
      <div className="flex items-center gap-8">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D338B] flex items-center justify-center text-white border border-[#2D338B]/10">
            <Shield className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h2 className="text-lg font-black tracking-tighter leading-none">
              <span className="text-[#2D338B]">TAM</span>
              <span className="text-[#F7941E]">CON.</span>
            </h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">ADMIN CONTROL PANEL</p>
          </div>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Links */}
        <Link href="/admin/settings" className="hidden md:block text-xs font-bold text-zinc-500 hover:text-[#2D338B] transition-colors">
          System Settings
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-[#2D338B]">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 bg-zinc-50/50 border border-zinc-100 rounded-2xl p-1.5 pr-4 pl-1.5 hover:bg-zinc-100/50 transition-colors cursor-pointer group">
          <Avatar className="h-10 w-10 border-2 border-white">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback className="bg-[#D81B60] text-white text-sm font-black uppercase">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-[13px] font-black text-zinc-900 leading-none">{user?.fullName || 'Abera M.'}</p>
            <p className="text-[11px] text-zinc-500 font-medium mt-1">Administrator</p>
          </div>
          <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 transition-colors ml-1" />
        </div>
      </div>
    </header>
  );
}
