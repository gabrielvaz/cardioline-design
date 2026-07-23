'use client';
import * as React from 'react';
import { Button, Card, CardContent, Checkbox, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger } from '@cardioline/ui';
import { PrototypeToast } from '@/components/ui/prototype-toast';

const tabs = ['General', 'Units', 'PDF', 'ECG', 'Holter', 'ABPM', 'Stress'] as const;
type Tab = typeof tabs[number];

export default function ReportSettingsPage() {
  const [tab, setTab] = React.useState<Tab>('General');
  const [toast, setToast] = React.useState<string | null>(null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-accent">Report settings</h1>
      <Card className="min-h-[580px]">
        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
          <TabsList className="px-6">
            {tabs.map((item) => <TabsTrigger key={item} value={item} className="px-5 py-4 text-base">{item}</TabsTrigger>)}
          </TabsList>
          <CardContent className="p-8">
            {tabs.map((item) => <TabsContent key={item} value={item} className="mt-0">{item === 'General' ? <General /> : <Simple title={item} />}</TabsContent>)}
            <div className="mt-12 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setToast('Changes discarded.')}>Cancel</Button>
              <Button onClick={() => setToast(`${tab} report settings saved.`)}>Save</Button>
            </div>
          </CardContent>
        </Tabs>
      </Card>
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function General() {
  return <div className="grid gap-6 md:grid-cols-2">
    <div className="space-y-5">
      <Field label="First row" />
      <Field label="Second row" />
      <label className="flex items-center gap-3 text-sm font-medium text-foreground"><Checkbox id="enable-logo" />Enable logo</label>
      <Field label="Logo position" placeholder="Select an option" />
    </div>
    <div className="space-y-5">
      <Field label="Third row" />
      <Field label="Fourth row" />
      <div className="space-y-2"><Label>Logo file</Label><Button asChild variant="outline"><label className="cursor-pointer"><input type="file" accept="image/*" className="sr-only" />Upload</label></Button></div>
    </div>
  </div>;
}
function Simple({ title }: { title: string }) { return <div className="grid max-w-3xl gap-5 md:grid-cols-2"><Field label={`${title} report header`} /><Field label={`${title} default template`} /><Field label="Clinical footer" /><Field label="Display units" /></div>; }
function Field({ label, placeholder = 'Type here' }: { label: string; placeholder?: string }) { return <div className="space-y-2"><Label htmlFor={label}>{label}</Label><Input id={label} placeholder={placeholder} /></div>; }
