"use client";

import { useState, useEffect, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '@/services/api/ticket.api';
import { paymentApi } from '@/services/api/payment.api';
import { walletApi } from '@/services/api/wallet.api';
import { extractArray } from '@/lib/extractArray';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Ticket as TicketIcon, 
  Plus, 
  ShoppingCart,
  Loader2,
  AlertCircle,
  Wallet,
  Eye,
  EyeOff
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams, useRouter } from 'next/navigation';

const TICKET_PRICE = 10;

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}

function TicketsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment') || searchParams.get('status');
    const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref');

    if (paymentStatus === 'success') {
      if (txRef && txRef.startsWith('LOT')) {
        toast.success('Ticket purchased successfully! Good luck in the draw.');
        router.replace('/dashboard/tickets');
      } else {
        toast.success('Payment successful!');
        router.replace('/dashboard/tickets');
      }
      queryClient.invalidateQueries({ queryKey: ['active-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-history'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    }
    if (paymentStatus === 'error' || paymentStatus === 'failed') {
      toast.error('Payment failed or was cancelled.');
    }
  }, [searchParams, queryClient, router]);

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: () => walletApi.getBalance(),
  });

  const { data: ticketHistoryData, isLoading: historyLoading } = useQuery({
    queryKey: ['ticket-history'],
    queryFn: () => ticketApi.getTicketHistory(),
  });

  const buyMutation = useMutation({
    mutationFn: () => ticketApi.buyTicket(1),
    onSuccess: (data) => {
      if (data?.checkoutUrl) {
        toast.info('Opening secure checkout...');
        window.location.href = data.checkoutUrl;
      } else {
        toast.success(`Successfully purchased ticket!`);
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['active-tickets'] });
        queryClient.invalidateQueries({ queryKey: ['balance'] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to purchase ticket');
    },
  });

  const ticketHistory = extractArray(ticketHistoryData);
  const userBalance = balanceData?.balance ?? 0;
  const canAfford = userBalance >= TICKET_PRICE;

  if (balanceLoading || historyLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">Manage your tickets and join the weekly draw.</p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger render={
              <Button className="bg-[#2D338B] hover:bg-[#2D338B]/90 shadow-lg shadow-[#2D338B]/20 font-bold">
                <Plus className="mr-2 h-4 w-4" /> Buy Ticket
              </Button>
            } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TicketIcon className="h-5 w-5 text-[#2D338B]" />
                Purchase Weekly Ticket
              </DialogTitle>
              <DialogDescription>
                Buy a ticket for the upcoming draw. Only one ticket per draw is allowed.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6">
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 text-center">
                <p className="text-sm text-muted-foreground mb-1">Ticket Price</p>
                <p className="text-3xl font-black text-[#2D338B]">{TICKET_PRICE} ETB</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">Your Balance</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-zinc-400 hover:text-[#2D338B] rounded-full"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  <span className={canAfford ? 'text-green-600 font-bold' : 'text-destructive font-bold'}>
                    {showBalance ? `${userBalance.toLocaleString()} ETB` : '*** ETB'}
                  </span>
                </div>
                {!canAfford && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100 text-amber-800 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>You don't have enough balance. You will be redirected to Chapa to complete the payment.</p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                className="w-full h-12 text-lg font-bold bg-[#2D338B]" 
                disabled={buyMutation.isPending}
                onClick={() => buyMutation.mutate()}
              >
                {buyMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingCart className="mr-2 h-5 w-5" />
                )}
                Buy with Chapa
              </Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border border-zinc-100 shadow-sm overflow-hidden pt-0">
        <CardHeader className="bg-zinc-50/50 border-b">
          <CardTitle className="text-lg">Purchase History</CardTitle>
          <CardDescription>A complete log of all your ticket purchases.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/30">
              <TableRow>
                <TableHead className="font-bold">Ticket Number</TableHead>
                <TableHead className="font-bold">Purchase Date</TableHead>
                <TableHead className="font-bold">Price</TableHead>
                <TableHead className="font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketHistory.map((ticket: any) => (
                <TableRow key={ticket._id || ticket.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="font-mono font-bold text-[#2D338B]">
                    #{ticket.ticketNumber || ticket.number}
                  </TableCell>
                  <TableCell className="font-medium">
                    {ticket.purchaseDate ? format(new Date(ticket.purchaseDate), 'MMM d, yyyy HH:mm') : '—'}
                  </TableCell>
                  <TableCell className="font-bold">{ticket.ticketPrice || ticket.price || TICKET_PRICE} ETB</TableCell>
                  <TableCell>
                    <Badge variant={
                      ticket.status === 'won' ? 'default' : 
                      ticket.status === 'lost' ? 'secondary' : 'outline'
                    } className={ticket.status === 'won' ? 'bg-green-500 hover:bg-green-600' : 'capitalize'}>
                      {ticket.status || 'active'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {ticketHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <TicketIcon className="h-8 w-8 opacity-20" />
                      <p>No ticket history found. Buy your first ticket to get started!</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TicketsContent />
    </Suspense>
  );
}
