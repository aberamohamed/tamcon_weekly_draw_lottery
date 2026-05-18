"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentReceiptView } from '@/components/shared/PaymentReceiptView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

function ReceiptContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get('trx_ref') || searchParams.get('tx_ref');
  const status = searchParams.get('status');

  if (!txRef && status !== 'missing_ref') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D338B]"></div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Verifying your payment...</h1>
          <p className="text-muted-foreground">Please wait while we confirm your transaction with Chapa.</p>
        </div>
      </div>
    );
  }

  if (status === 'missing_ref' || (!txRef && status === 'failed')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Payment Verification Pending</h1>
          <p className="text-muted-foreground max-w-md">
            We couldn't verify your payment reference immediately. Don't worry, your wallet will be updated automatically once the bank confirms the transfer.
          </p>
        </div>
        <Button asChild className="bg-[#2D338B]">
          <Link href="/dashboard/tickets">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return <PaymentReceiptView txRef={txRef || ''} />;
}

export default function PaymentReceiptPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  );
}
