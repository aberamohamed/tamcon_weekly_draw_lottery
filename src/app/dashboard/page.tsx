'use client';

import { useQuery } from '@tanstack/react-query';
import { walletApi } from '@/services/api/wallet.api';
import { ticketApi } from '@/services/api/ticket.api';
import { drawApi } from '@/services/api/draw.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  Ticket as TicketIcon,
  Trophy,
  ArrowUpRight,
  Clock,
  History,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  TicketSkeleton,
  DrawBallSkeleton,
  StatsCardSkeleton,
  FadeIn
} from '@/components/shared/LotterySkeletons';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: walletApi.getBalance,
  });

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['active-tickets'],
    queryFn: ticketApi.getActiveTickets,
  });

  const { data: latestDraw, isLoading: drawLoading } = useQuery({
    queryKey: ['latest-draw'],
    queryFn: drawApi.getLatestDraw,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your tickets.</p>
        </div>
        <Button asChild className="shadow-lg shadow-primary/20">
          <Link href="/dashboard/tickets">
            <TicketIcon className="mr-2 h-4 w-4" />
            Buy New Tickets
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-md bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary-foreground/70" />
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <StatsCardSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-3xl font-bold"
              >
                {balanceData?.balance.toLocaleString()} ETB
              </motion.div>
            )}
            <p className="text-xs text-primary-foreground/70 mt-1 flex items-center">
              Available for immediate use
            </p>
            <Button variant="secondary" size="sm" className="w-full mt-4 bg-white/20 hover:bg-white/30 border-none text-white">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Deposit Funds
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ticketsLoading ? (
              <StatsCardSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-3xl font-bold"
              >
                {ticketsData?.length || 0}
              </motion.div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Participating in upcoming draw
            </p>
            <Link href="/dashboard/tickets" className="text-xs text-primary font-medium hover:underline flex items-center mt-4">
              <History className="mr-1 h-3 w-3" />
              View ticket history
            </Link>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Latest Draw Result</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {drawLoading ? (
              <DrawBallSkeleton />
            ) : (
              <div className="flex flex-wrap gap-3">
                {latestDraw?.winningNumber.split('').map((num, i) => {
                  const isWinner = i === latestDraw.winningNumber.length - 1; // Last ball as the winner ball
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white transition-all leading-none ${isWinner
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
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Upcoming Draw
            </CardTitle>
            <CardDescription>Next drawing is in 2 days, 4 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Estimated Jackpot</p>
                <p className="text-xl font-bold">25,000.00 ETB</p>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            </div>
            <Button className="w-full">Set Reminder</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 h-5 w-5 text-primary" />
              Recent Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticketsLoading ? (
                Array(3).fill(0).map((_, i) => <TicketSkeleton key={i} />)
              ) : ticketsData?.length ? (
                ticketsData.slice(0, 3).map((ticket, i) => (
                  <FadeIn key={ticket.id} delay={i * 0.1}>
                    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-[#2D338B]">{ticket.number}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(ticket.purchaseDate), 'PPP')}</p>
                      </div>
                      <Badge variant="outline" className="border-[#F7941E] text-[#F7941E]">{ticket.status}</Badge>
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
