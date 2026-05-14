'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Trophy, Ticket, Wallet, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const notifications = [
  {
    id: 1,
    title: 'You Won!',
    message: 'Congratulations! Your ticket #823491 was a winner in the Weekly Draw #12. 5,000 ETB has been added to your wallet.',
    type: 'winner',
    date: new Date(),
    read: false,
    icon: Trophy,
    color: 'text-yellow-500 bg-yellow-100',
  },
  {
    id: 2,
    title: 'Ticket Purchased',
    message: 'You have successfully purchased 5 tickets for the upcoming Friday draw.',
    type: 'purchase',
    date: new Date(Date.now() - 86400000),
    read: true,
    icon: Ticket,
    color: 'text-blue-500 bg-blue-100',
  },
  {
    id: 3,
    title: 'New Draw Announced',
    message: 'The jackpot for the next draw has reached 25,000 ETB! Don\'t miss out.',
    type: 'info',
    date: new Date(Date.now() - 172800000),
    read: true,
    icon: Calendar,
    color: 'text-purple-500 bg-purple-100',
  },
  {
    id: 4,
    title: 'Deposit Successful',
    message: 'Your deposit of 1,000 ETB via Telebirr was successful.',
    type: 'wallet',
    date: new Date(Date.now() - 259200000),
    read: true,
    icon: Wallet,
    color: 'text-green-500 bg-green-100',
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your wins and platform news.</p>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>You have {notifications.filter(n => !n.read).length} unread messages.</CardDescription>
          </div>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Mark all as read</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-6 flex gap-4 transition-colors hover:bg-zinc-50 ${!n.read ? 'bg-primary/5' : ''}`}
              >
                <div className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center ${n.color}`}>
                  <n.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-bold ${!n.read ? 'text-foreground' : 'text-zinc-600'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(n.date, 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                  {!n.read && (
                    <div className="pt-2">
                      <Badge className="h-2 w-2 rounded-full p-0 border-none" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
