'use client';
import * as React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Switch } from '@cardioline/ui';
import { PrototypeToast } from '@/components/ui/prototype-toast';

const items = ['Critical ECG findings', 'Report ready for review', 'Device status changes'];

export default function NotificationsPage() {
  const [toast, setToast] = React.useState<string | null>(null);
  return (
    <Card>
      <CardHeader><CardTitle>Notification preferences</CardTitle></CardHeader>
      <CardContent>
        {items.map((item, index) => (
          <div key={item} className="flex items-center justify-between border-t border-border py-4 text-sm font-medium text-foreground">
            <span>{item}</span>
            <Switch defaultChecked={index < 2} aria-label={item} />
          </div>
        ))}
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setToast('Notification preferences saved.')}>Save changes</Button>
        </div>
        <PrototypeToast message={toast} onClose={() => setToast(null)} />
      </CardContent>
    </Card>
  );
}
