'use client';

export function AdminFooter() {
  return (
    <footer className="h-14 border-t bg-white flex items-center justify-between px-6 mt-auto">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-[#2D338B] flex items-center justify-center text-white text-[10px] font-black">T</div>
        <p className="text-[11px] font-bold text-zinc-400">
          © 2026 <span className="text-[#2D338B]">TAMCON ADMIN SYSTEMS.</span> All rights reserved.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="h-4 w-[1px] bg-zinc-100 hidden sm:block" />
        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">ADMIN V1.0.0</span>
      </div>
    </footer>
  );
}
