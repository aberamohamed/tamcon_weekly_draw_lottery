'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Search, 
  Shield, 
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut
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

export function AdminHeader() {
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const displayName = user?.fullName || 'Admin User';
  const initials = getInitials(displayName);
  const displayRole = user?.role === 'admin' ? 'Administrator' : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin');

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

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none border-none bg-transparent p-0 m-0 cursor-pointer">
            <div className="flex items-center gap-3 bg-zinc-50/50 border border-zinc-100 rounded-2xl p-1.5 pr-4 pl-1.5 hover:bg-zinc-100/50 transition-colors cursor-pointer group">
              <div className="h-10 w-10 rounded-full border-2 border-white bg-[#D81B60] text-white text-sm font-black uppercase flex items-center justify-center shadow-sm">
                {initials}
              </div>
              <div className="hidden md:block">
                <p className="text-[13px] font-black text-zinc-900 leading-none group-hover:text-[#2D338B] transition-colors">{displayName}</p>
                <p className="text-[11px] text-zinc-500 font-medium mt-1">{displayRole}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-[#2D338B] transition-colors ml-1" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-zinc-100 shadow-xl">
            <DropdownMenuItem className="rounded-xl cursor-pointer p-0 font-semibold hover:bg-zinc-50">
              <Link href="/admin/settings" className="flex items-center w-full p-3">
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
              Are you sure you want to log out of the admin panel?
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
