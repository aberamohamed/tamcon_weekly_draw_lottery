'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/api/admin.api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search, ArrowDownCircle, ArrowUpCircle, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: adminApi.getTransactions,
  });

  // Mock data if API returns nothing for now
  const displayTransactions = (transactions as any) || [
    { id: 'TX1001', user: 'Abebe Bikila', type: 'deposit', amount: 500, status: 'completed', date: new Date() },
    { id: 'TX1002', user: 'Sara Jenkins', type: 'purchase', amount: 30, status: 'completed', date: new Date() },
    { id: 'TX1003', user: 'John Doe', type: 'withdrawal', amount: 200, status: 'pending', date: new Date() },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Monitor all financial activities on the platform.</p>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Global Transactions</CardTitle>
              <CardDescription>View deposits, withdrawals, and ticket purchases.</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID or user..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTransactions.map((tx: any) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                    <TableCell className="font-medium">{tx.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.type === 'deposit' && <ArrowDownCircle className="h-4 w-4 text-green-500" />}
                        {tx.type === 'withdrawal' && <ArrowUpCircle className="h-4 w-4 text-red-500" />}
                        {tx.type === 'purchase' && <ShoppingBag className="h-4 w-4 text-blue-500" />}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount.toLocaleString()} ETB
                    </TableCell>
                    <TableCell>{format(new Date(tx.date), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
