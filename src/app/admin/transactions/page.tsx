'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/api/admin.api';
import { extractArray } from '@/lib/extractArray';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Search, ArrowDownCircle, ArrowUpCircle, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-10 w-72 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array(7).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: () => adminApi.getTransactions(),
  });

  if (isLoading) return <PageSkeleton />;

  const allTransactions = extractArray(transactionsData);

  const getUserDisplayStr = (tx: any) => {
    const u = tx.user || tx.userId;
    if (typeof u === 'object' && u !== null) {
      return u.fullName || u.email || u._id || '—';
    }
    return u || tx.userEmail || '—';
  };

  const filteredTransactions = allTransactions.filter((tx: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const userStr = getUserDisplayStr(tx).toLowerCase();
    return (
      tx.id?.toLowerCase().includes(term) ||
      tx._id?.toLowerCase().includes(term) ||
      userStr.includes(term)
    );
  });

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
              <CardDescription>Total of {allTransactions.length} transactions found.</CardDescription>
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
              {filteredTransactions.map((tx: any) => (
                <TableRow key={tx._id || tx.id}>
                  <TableCell className="font-mono text-xs">{tx._id || tx.id}</TableCell>
                  <TableCell className="font-medium">
                    {getUserDisplayStr(tx)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.type === 'deposit' && <ArrowDownCircle className="h-4 w-4 text-green-500" />}
                      {tx.type === 'withdrawal' && <ArrowUpCircle className="h-4 w-4 text-red-500" />}
                      {(tx.type === 'purchase' || tx.type === 'ticket_purchase') && <ShoppingBag className="h-4 w-4 text-blue-500" />}
                      <span className="capitalize">{tx.type?.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {tx.type === 'withdrawal' ? '-' : '+'}{(tx.amount || 0).toLocaleString()} ETB
                  </TableCell>
                  <TableCell>
                    {tx.date || tx.createdAt
                      ? format(new Date(tx.date || tx.createdAt), 'MMM d, yyyy HH:mm')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                      {tx.status || 'unknown'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No transactions found.
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
