'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton = ({ className, variant = 'rect' }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-zinc-100",
        variant === 'circle' ? 'rounded-full' : 'rounded-lg',
        className
      )}
    >
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent shadow-none"
      />
    </div>
  );
};

export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

export const StatsCardSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-8 w-24" />
    <Skeleton className="h-3 w-32" />
  </div>
);

export const DrawBallSkeleton = () => (
  <div className="flex gap-2">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} className="h-10 w-10 rounded-full" />
    ))}
  </div>
);

export const TicketSkeleton = () => (
  <div className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
    <div className="space-y-1">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-5 w-16 rounded-full" />
  </div>
);

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full p-4 md:p-0">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48 md:w-64" />
        <Skeleton className="h-4 w-64 md:w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white border border-zinc-100 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-zinc-100 rounded-xl space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        <div className="p-6 bg-white border border-zinc-100 rounded-xl space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
