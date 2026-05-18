'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { walletApi } from '@/services/api/wallet.api';
import {
  Eye,
  EyeOff,
  Trophy,
  ChevronDown,
  Wallet,
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const { data: balanceData } = useQuery({
    queryKey: ['balance'],
    queryFn: () => walletApi.getBalance(),
  });
  const balance = balanceData?.balance ?? 0;

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const displayName = user?.fullName || 'Customer';
  const initials = getInitials(displayName);
  const displayRole = user?.role === 'customer' ? 'Customer' : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User');

  return (
    <header className="h-16 border-b bg-white fixed top-0 left-0 right-0 z-[60] px-4 md:px-6 flex items-center justify-between">
      {/* Left: Brand */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D338B] flex items-center justify-center text-white border border-[#2D338B]/10">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h2 className="text-lg font-black tracking-tighter leading-none">
              <span className="text-[#2D338B]">TAM</span>
              <span className="text-[#F7941E]">CON</span>
            </h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">LOTTERY</p>
          </div>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Links */}
        <Link href="/dashboard/results" className="hidden md:block text-xs font-bold text-zinc-500 hover:text-[#2D338B] transition-colors">
          Draw Results
        </Link>

        {/* Modern Wallet Balance UI */}
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1.5 transition-all hover:border-[#2D338B]/30 hover:bg-[#2D338B]/5">
          <Wallet className="h-4 w-4 text-[#2D338B]" />
          <div className="w-[80px] text-right">
            <span className="text-sm font-bold text-zinc-800">
              {showBalance ? `${balance.toLocaleString()} ETB` : '*** ETB'}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-zinc-400 hover:text-[#2D338B] rounded-full"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none border-none bg-transparent p-0 m-0 cursor-pointer">
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 cursor-pointer group">
              <div className="h-10 w-10 rounded-full border-4 border-zinc-50/50 group-hover:border-zinc-100 bg-[#FFF7ED] text-[#F7941E] text-sm font-black border border-[#F7941E]/10 flex items-center justify-center shadow-sm transition-colors">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[13px] font-black text-[#2D338B] tracking-tight uppercase leading-none group-hover:text-[#F7941E] transition-colors">{displayName}</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.1em] mt-1">{displayRole}</p>
              </div>
              <ChevronDown className="h-5 w-5 text-zinc-400 group-hover:text-[#2D338B] transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-zinc-100 shadow-xl">
            <DropdownMenuItem className="rounded-xl cursor-pointer p-0 font-semibold hover:bg-zinc-50">
              <Link href="/dashboard/settings" className="flex items-center w-full p-3">
                <Settings className="mr-2 h-4 w-4 text-zinc-500" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-100 my-1" />
            <DropdownMenuItem 
              className="rounded-xl cursor-pointer p-3 font-semibold text-red-600 focus:bg-red-50 focus:text-red-700"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#2D338B]">Confirm Logout</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Are you sure you want to securely log out of your session? You will need to verify your email with an OTP to log back in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0 mt-6">
            <Button variant="outline" className="rounded-xl font-bold h-12" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              className="rounded-xl font-bold h-12 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                logout();
                setShowLogoutDialog(false);
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
