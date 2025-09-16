import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import React from 'react'

export default function PaymentWarning() {
  return (
      <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-amber-600">Important</AlertTitle>
          <AlertDescription className="text-amber-600 w-full">
              Your memo/reference is important for verifying your payment. &quot;Do not confirm&quot; before sending the
              payment, otherwise your payment will fail. First, send your payment manually through your wallet, then
              click &quot;Confirm Payment&quot;. Also, &quot;do not reload&quot; the page during the payment process.
          </AlertDescription>
      </Alert>
  );
}
