'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '@/services/api/ticket.api';
import { walletApi } from '@/services/api/wallet.api';
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Ticket as TicketIcon, 
  History, 
  Plus, 
  Minus, 
  ShoppingCart,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const TICKET_PRICE = 10;

export default function TicketsPage() {
  const [ticketCount, setTicketCount] = useState(1);
  const queryClient = useQueryClient();

  const { data: balanceData } = useQuery({
    queryKey: ['balance'],
    queryFn: walletApi.getBalance,
  });

  const { data: ticketHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['ticket-history'],
    queryFn: ticketApi.getTicketHistory,
  });

  const buyMutation = useMutation({
    mutationFn: (count: number) => ticketApi.buyTicket(count),
    onSuccess: () => {
      toast.success(`Successfully purchased ${ticketCount} ticket(s)!`);
      queryClient.invalidateQueries({ queryKey: ['active-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-history'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      setTicketCount(1);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to purchase tickets. Check your balance.');
    },
  });

  const totalPrice = ticketCount * TICKET_PRICE;
  const canAfford = (balanceData?.balance || 0) >= totalPrice;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
        <p className="text-muted-foreground">Manage your tickets and join the weekly draw.</p>
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="buy" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Buy Tickets
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> Purchase History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2 border border-zinc-100 overflow-hidden">
              <div className="bg-primary/5 p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <TicketIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Weekly Draw Entry</h3>
                    <p className="text-sm text-muted-foreground">Drawing on Friday, 8:00 PM</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Ticket Price</p>
                    <p className="text-4xl font-black text-primary">{TICKET_PRICE} ETB</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full h-12 w-12"
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                      disabled={ticketCount <= 1}
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    <div className="text-4xl font-bold w-12 text-center">
                      {ticketCount}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full h-12 w-12"
                      onClick={() => setTicketCount(ticketCount + 1)}
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="w-full pt-6 border-t space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Total Cost</span>
                      <span className="font-bold">{totalPrice.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Balance</span>
                      <span className={canAfford ? 'text-green-600 font-medium' : 'text-destructive font-medium'}>
                        {balanceData?.balance.toLocaleString()} ETB
                      </span>
                    </div>
                    <Button 
                      className="w-full h-12 text-lg border border-primary/10" 
                      disabled={!canAfford || buyMutation.isPending}
                      onClick={() => buyMutation.mutate(ticketCount)}
                    >
                      {buyMutation.isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <ShoppingCart className="mr-2 h-5 w-5" />
                      )}
                      {canAfford ? 'Purchase Now' : 'Insufficient Balance'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Tips & Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-400">
                <p>• Each ticket gives you one chance to win the weekly jackpot.</p>
                <p>• Tickets are generated automatically with unique numbers.</p>
                <p>• You can buy up to 50 tickets per draw.</p>
                <p>• Winning numbers are announced every Friday.</p>
                <div className="pt-4 mt-4 border-t border-zinc-800">
                  <p className="text-zinc-50 font-medium mb-2">Need more funds?</p>
                  <Button variant="secondary" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-none">
                    Deposit via Telebirr
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border border-zinc-100">
            <CardHeader>
              <CardTitle>Ticket History</CardTitle>
              <CardDescription>A complete log of all your ticket purchases and their status.</CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-2">
                  {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket #</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ticketHistory?.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.number}</TableCell>
                        <TableCell>{format(new Date(ticket.purchaseDate), 'MMM d, yyyy HH:mm')}</TableCell>
                        <TableCell>{ticket.price} ETB</TableCell>
                        <TableCell>
                          <Badge variant={
                            ticket.status === 'won' ? 'default' : 
                            ticket.status === 'lost' ? 'secondary' : 'outline'
                          } className={ticket.status === 'won' ? 'bg-green-500' : ''}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {ticketHistory?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No ticket history found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
