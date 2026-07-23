'use client';

import * as React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export function PrototypeToast({ message, onClose }: { message: string | null; onClose: () => void }) {
  React.useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);
  if (!message) return null;
  return <div role="status" className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-[toast-rise_240ms_ease-out] items-center gap-3 rounded-lg border border-green-100 bg-white px-4 py-3 text-sm text-gray-700 shadow-xl">
    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
    <span className="min-w-0 flex-1">{message}</span><button onClick={onClose} aria-label="Dismiss notification" className="ml-auto shrink-0 text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button>
  </div>;
}
