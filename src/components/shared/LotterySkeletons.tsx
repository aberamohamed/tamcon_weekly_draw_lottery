'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Ticket, Trophy } from 'lucide-react';

export const TicketSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden bg-card rounded-xl border-2 border-dashed border-muted p-6 flex justify-between items-center"
  >
    <div className="space-y-2">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>
    {/* Decorative punch holes */}
    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-r-2 border-dashed border-muted" />
    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-l-2 border-dashed border-muted" />
  </motion.div>
);

export const DrawBallSkeleton = () => (
  <div className="flex gap-4 justify-center py-8">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <motion.div
        key={i}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.1, type: 'spring' }}
      >
        <Skeleton className="h-14 w-14 rounded-full shadow-inner" />
      </motion.div>
    ))}
  </div>
);

export const StatsCardSkeleton = () => (
  <CardSkeleton className="h-32" />
);

export const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`p-6 rounded-2xl bg-card border shadow-sm space-y-4 ${className}`}>
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-4 w-full" />
  </div>
);

export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);
