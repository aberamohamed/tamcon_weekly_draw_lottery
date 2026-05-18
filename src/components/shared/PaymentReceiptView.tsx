'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '@/services/api/payment.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Download, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface PaymentReceiptViewProps {
  txRef: string;
}

export function PaymentReceiptView({ txRef }: PaymentReceiptViewProps) {
  const { data: receipt, isLoading, isError } = useQuery({
    queryKey: ['payment-verification', txRef],
    queryFn: () => paymentApi.verifyPayment(txRef),
    enabled: !!txRef,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Verifying your payment with Chapa...</p>
      </div>
    );
  }

  if (isError || !receipt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Verification Failed</h1>
        <p className="text-muted-foreground max-w-md">
          We couldn't verify your payment. If you've been charged, please contact support with your reference: <br/>
          <span className="font-mono font-bold text-foreground">{txRef}</span>
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/tickets">Back to Tickets</Link>
          </Button>
          <Button onClick={() => window.location.reload()}>Retry Verification</Button>
        </div>
      </div>
    );
  }

  const isSuccess = receipt.status === 'success' || receipt.message?.includes('success');

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4 pt-12 md:pt-24">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/tickets">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#2D338B]">Payment Receipt</h1>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden bg-white">
        <div className={`h-2 ${isSuccess ? 'bg-green-500' : 'bg-amber-500'}`} />
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            ) : (
              <div className="bg-amber-100 p-3 rounded-full">
                <Loader2 className="h-12 w-12 text-amber-600 animate-spin" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-black text-[#2D338B]">
            {isSuccess ? 'Payment Successful' : 'Processing Payment'}
          </CardTitle>
          <CardDescription className="text-lg">
            {isSuccess ? 'Your tickets have been generated!' : 'We are finalizing your transaction...'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8 py-6 border-y border-dashed border-zinc-200">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Amount Paid</p>
              <p className="text-2xl font-black text-[#2D338B]">{receipt.amount || '—'} ETB</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Date</p>
              <p className="text-lg font-bold">{format(new Date(), 'MMM d, yyyy')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Transaction Ref</p>
              <p className="text-sm font-mono font-bold break-all">{txRef}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Status</p>
              <Badge className={isSuccess ? 'bg-green-500' : 'bg-amber-500'}>
                {receipt.status || 'Verified'}
              </Badge>
            </div>
          </div>

          {isSuccess && (
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-[#2D338B]">
                <Ticket className="h-4 w-4 text-primary" />
                Next Steps
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your wallet has been credited and your tickets are now active in the upcoming draw. 
                You can view them in your ticket history.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-[#2D338B] hover:bg-[#2D338B]/90" asChild>
                  <Link href="/dashboard/tickets">View My Tickets</Link>
                </Button>
                <Button variant="outline" className="flex-1 border-zinc-200" onClick={() => window.print()}>
                  <Download className="mr-2 h-4 w-4" /> Print Receipt
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <p className="text-center text-xs text-muted-foreground pb-12">
        If you have any questions, please contact support with your Transaction Reference.
      </p>
    </div>
  );
}
