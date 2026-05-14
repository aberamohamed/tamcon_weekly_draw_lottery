'use client';

import { useQuery } from '@tanstack/react-query';
import { drawApi } from '@/services/api/draw.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trophy, Calendar, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResultsPage() {
  const { data: drawHistory, isLoading } = useQuery({
    queryKey: ['draw-history'],
    queryFn: drawApi.getDrawHistory,
  });

  const latestDraw = drawHistory?.[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Draw Results</h1>
        <p className="text-muted-foreground">Check the winning numbers and pool distributions.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : latestDraw && (
        <Card className="border-none shadow-xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy className="h-48 w-48" />
          </div>
          <CardHeader className="relative z-10">
            <Badge className="w-fit mb-2 bg-primary hover:bg-primary">LATEST RESULT</Badge>
            <CardTitle className="text-3xl">Weekly Draw #{latestDraw.id.slice(0, 8)}</CardTitle>
            <CardDescription className="text-zinc-400">
              Drawn on {format(new Date(latestDraw.drawDate), 'PPPP')}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 pt-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">Winning Number</p>
                <div className="text-6xl font-black tracking-widest text-primary">
                  {latestDraw.winningNumber}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                    <DollarSign className="h-3 w-3" /> Total Pool
                  </div>
                  <p className="text-lg font-bold">{latestDraw.totalPool.toLocaleString()} ETB</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                    <Users className="h-3 w-3" /> Total Winners
                  </div>
                  <p className="text-lg font-bold">{latestDraw.winnersCount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Previous Draws</CardTitle>
          <CardDescription>History of all previous weekly drawings.</CardDescription>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Winning Number</TableHead>
                  <TableHead>Total Pool</TableHead>
                  <TableHead>Winners</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drawHistory?.map((draw) => (
                  <TableRow key={draw.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(draw.drawDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-bold text-primary">{draw.winningNumber}</span>
                    </TableCell>
                    <TableCell>{draw.totalPool.toLocaleString()} ETB</TableCell>
                    <TableCell>{draw.winnersCount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Completed</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {drawHistory?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No draw history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
