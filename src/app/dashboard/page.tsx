'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { walletApi } from '@/services/api/wallet.api';
import { ticketApi } from '@/services/api/ticket.api';
import { drawApi } from '@/services/api/draw.api';
import { extractArray } from '@/lib/extractArray';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Wallet,
  Ticket as TicketIcon,
  Trophy,
  ArrowUpRight,
  Clock,
  History,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/shared/LotterySkeletons';

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(false);
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: () => walletApi.getBalance(),
  });

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['active-tickets'],
    queryFn: () => ticketApi.getActiveTickets(),
  });

  const { data: latestDraw, isLoading: drawLoading } = useQuery({
    queryKey: ['latest-draw'],
    queryFn: () => drawApi.getLatestDraw(),
  });

  const isLoading = balanceLoading || ticketsLoading || drawLoading;

  if (isLoading) return <PageSkeleton />;

  const activeTickets = extractArray(ticketsData);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your tickets.</p>
        </div>
        <Button asChild className="border-zinc-200/50">
          <Link href="/dashboard/tickets">
            <TicketIcon className="mr-2 h-4 w-4" />
            Buy New Tickets
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-primary-foreground/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Wallet className="h-4 w-4 text-primary-foreground/70" />
            </div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-3xl font-bold"
            >
              {showBalance ? `${(balanceData?.balance ?? 0).toLocaleString()} ETB` : '*** ETB'}
            </motion.div>
            <p className="text-xs text-primary-foreground/70 mt-1 flex items-center">
              Available for immediate use
            </p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-3xl font-bold"
            >
              {activeTickets.length}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">
              Participating in upcoming draw
            </p>
            <Link href="/dashboard/tickets" className="text-xs text-primary font-medium hover:underline flex items-center mt-4">
              <History className="mr-1 h-3 w-3" />
              View ticket history
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Latest Draw Result</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {latestDraw?.winningNumber ? (
              <div className="flex flex-wrap gap-3">
                {latestDraw.winningNumber.split('').map((num: string, i: number) => {
                  const isWinner = i === latestDraw.winningNumber.length - 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white transition-all leading-none ${isWinner
                          ? 'bg-gradient-to-br from-green-500 to-green-700 text-white scale-110 ring-4 ring-green-500/20'
                          : 'bg-gradient-to-br from-[#F7941E] to-[#F7941E]/70 text-white'
                        }`}
                    >
                      {num}
                      {isWinner && <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 fill-current" />}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">Waiting for draw results...</p>
            )}
            <p className="text-xs text-muted-foreground mt-4 font-semibold">
              Draw Date: {latestDraw?.drawDate ? format(new Date(latestDraw.drawDate), 'PPP') : 'N/A'}
            </p>
            <Link href="/dashboard/results" className="text-xs text-primary font-medium hover:underline flex items-center mt-4">
              <Trophy className="mr-1 h-3 w-3" />
              View all results
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-zinc-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Upcoming Draw
            </CardTitle>
            <CardDescription>
              {latestDraw?.drawDate
                ? `Next draw: ${format(new Date(latestDraw.drawDate), 'PPP')}`
                : 'Draw date not available'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Current Pool</p>
                <p className="text-xl font-bold">
                  {latestDraw?.totalPool != null
                    ? `${Number(latestDraw.totalPool).toLocaleString()} ETB`
                    : '—'}
                </p>
              </div>
              <Badge className={latestDraw?.status === 'upcoming' || latestDraw?.status === 'active' || latestDraw?.status === 'open'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-zinc-400 hover:bg-zinc-500'}>
                {latestDraw?.status ? latestDraw.status.charAt(0).toUpperCase() + latestDraw.status.slice(1) : 'No Draw'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 h-5 w-5 text-primary" />
              Recent Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTickets.length ? (
                activeTickets.slice(0, 3).map((ticket: any, i: number) => (
                  <FadeIn key={ticket._id || ticket.id} delay={i * 0.1}>
                    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-[#2D338B]">{ticket.number}</p>
                        <p className="text-xs text-muted-foreground">
                          {ticket.purchaseDate ? format(new Date(ticket.purchaseDate), 'PPP') : 'N/A'}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-[#F7941E] text-[#F7941E] capitalize">
                        {ticket.status || 'active'}
                      </Badge>
                    </div>
                  </FadeIn>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No active tickets.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
