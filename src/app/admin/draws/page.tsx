'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { drawApi } from '@/services/api/draw.api';
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
  DialogTrigger 
} from '@/components/ui/dialog';
import { Zap, Trophy, Calendar, Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDrawsPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: drawHistory, isLoading } = useQuery({
    queryKey: ['admin-draw-history'],
    queryFn: drawApi.getDrawHistory,
  });

  const triggerMutation = useMutation({
    mutationFn: drawApi.triggerDraw,
    onSuccess: () => {
      toast.success('Weekly draw triggered successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-draw-history'] });
      setIsConfirmOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to trigger draw.');
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Draw Management</h1>
          <p className="text-muted-foreground">Monitor draw history and trigger new weekly drawings.</p>
        </div>
        
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogTrigger render={
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" />
          }>
            <Zap className="mr-2 h-5 w-5 fill-current" />
            Trigger Weekly Draw
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Trigger Weekly Draw?
              </DialogTitle>
              <DialogDescription>
                This action will randomly select a winning number, identify winners, and distribute the pool. 
                This action is irreversible and will notify all participating users.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted p-4 rounded-lg space-y-2 my-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Tickets:</span>
                <span className="font-bold">1,245</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Pool:</span>
                <span className="font-bold">12,450.00 ETB</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => triggerMutation.mutate()} 
                disabled={triggerMutation.isPending}
              >
                {triggerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm & Trigger
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Draw History</CardTitle>
          <CardDescription>A complete log of all executed draws.</CardDescription>
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
                  <TableHead>Draw ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Winning #</TableHead>
                  <TableHead>Total Pool</TableHead>
                  <TableHead>Winners</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drawHistory?.map((draw) => (
                  <TableRow key={draw.id}>
                    <TableCell className="font-mono text-xs">{draw.id}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(draw.drawDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">{draw.winningNumber}</span>
                    </TableCell>
                    <TableCell>{draw.totalPool.toLocaleString()} ETB</TableCell>
                    <TableCell>{draw.winnersCount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-zinc-100 text-zinc-700">Completed</Badge>
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
