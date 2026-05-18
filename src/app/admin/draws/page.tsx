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
import { extractArray } from '@/lib/extractArray';

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-11 w-48 rounded-lg" />
      </div>
      <Card className="border border-zinc-100">
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDrawsPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: drawHistoryData, isLoading: historyLoading } = useQuery({
    queryKey: ['admin-draw-history'],
    queryFn: () => drawApi.getDrawHistory(),
  });

  const { data: drawsData, isLoading: drawsLoading } = useQuery({
    queryKey: ['admin-draws'],
    queryFn: () => drawApi.getDraws(),
  });

  const { data: currentDraw, isLoading: currentDrawLoading } = useQuery({
    queryKey: ['current-draw'],
    queryFn: () => drawApi.getLatestDraw(),
  });

  const drawHistory = extractArray(drawHistoryData);
  const allDraws = extractArray(drawsData);

  const nextDraw = allDraws.find((d: any) => d.status === 'upcoming' || d.status === 'pending' || d.status === 'open') || allDraws[0];
  const nextDrawId: string = nextDraw?._id || nextDraw?.id || '';

  const triggerMutation = useMutation({
    mutationFn: () => drawApi.triggerDraw(nextDrawId),
    onSuccess: () => {
      toast.success('Weekly draw triggered successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-draw-history'] });
      queryClient.invalidateQueries({ queryKey: ['admin-draws'] });
      queryClient.invalidateQueries({ queryKey: ['current-draw'] });
      setIsConfirmOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to trigger draw.');
    },
  });

  const isLoading = historyLoading || drawsLoading || currentDrawLoading;

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Draw Management</h1>
          <p className="text-muted-foreground">Monitor draw history and trigger new weekly drawings.</p>
        </div>
        
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogTrigger 
            render={
              <Button size="lg" className="bg-primary hover:bg-primary/90 border border-primary/10" />
            }
          >
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
                <span className="text-muted-foreground">Draw ID:</span>
                <span className="font-bold font-mono text-xs">{nextDrawId || '—'}</span>
              </div>
              {currentDraw && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-bold capitalize">{currentDraw.status || '—'}</span>
                  </div>
                  {currentDraw.totalPool != null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Pool:</span>
                      <span className="font-bold">{Number(currentDraw.totalPool).toLocaleString()} ETB</span>
                    </div>
                  )}
                </>
              )}
              {!nextDrawId && (
                <p className="text-xs text-amber-600 font-medium">No upcoming draw found. Check that a draw exists.</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => triggerMutation.mutate()} 
                disabled={triggerMutation.isPending || !nextDrawId}
              >
                {triggerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm & Trigger
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-zinc-100">
        <CardHeader>
          <CardTitle>Draw History</CardTitle>
          <CardDescription>A complete log of all executed draws.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {drawHistory.map((draw: any) => (
                <TableRow key={draw._id || draw.id}>
                  <TableCell className="font-mono text-xs">{draw._id || draw.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {draw.drawDate ? format(new Date(draw.drawDate), 'MMM d, yyyy') : '—'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-primary">{draw.winningNumber || '—'}</span>
                  </TableCell>
                  <TableCell>{draw.totalPool != null ? Number(draw.totalPool).toLocaleString() : '—'} ETB</TableCell>
                  <TableCell>{draw.winnersCount ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 capitalize">
                      {draw.status || 'completed'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {drawHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No draw history found.
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
