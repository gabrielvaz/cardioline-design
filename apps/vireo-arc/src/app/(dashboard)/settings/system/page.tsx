'use client';
import * as React from 'react';
import { Button, Card, CardContent, Input, Label, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from '@cardioline/ui';
import { PrototypeToast } from '@/components/ui/prototype-toast';

const tabs = ['System', 'GDPR', 'Authentication', 'Sign', 'WebChat'] as const;
type Tab = typeof tabs[number];

export default function SystemSettingsPage() {
  const [tab, setTab] = React.useState<Tab>('System');
  const [toast, setToast] = React.useState<string | null>(null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-accent">System settings</h1>
      <Card className="min-h-[620px]">
        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
          <TabsList className="px-6" aria-label="System settings sections">
            {tabs.map((item) => <TabsTrigger key={item} value={item} className="px-5 py-4 text-base">{item}</TabsTrigger>)}
          </TabsList>
          <CardContent className="p-8">
            <TabsContent value="System" className="mt-0"><SystemPanel /></TabsContent>
            <TabsContent value="GDPR" className="mt-0"><GdprPanel /></TabsContent>
            <TabsContent value="Authentication" className="mt-0"><AuthenticationPanel /></TabsContent>
            <TabsContent value="Sign" className="mt-0"><SignPanel /></TabsContent>
            <TabsContent value="WebChat" className="mt-0"><WebChatPanel /></TabsContent>
            <div className="mt-12 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setToast('Changes discarded.')}>Cancel</Button>
              <Button onClick={() => setToast(`${tab} settings saved.`)}>Save</Button>
            </div>
          </CardContent>
        </Tabs>
      </Card>
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function SystemPanel() { return <div className="grid gap-6 md:grid-cols-2"><Fields values={[['Repository path','C:\\inetpub\\wwwroot\\ecgwebapp\\App_Data\\repo'],['Working directory','C:\\inetpub\\wwwroot\\ecgwebapp\\App_Data\\workdir'],['Session timeout','60'],['WS Base URL',''],['Demographics association criteria','lastname,id; default value if not present']]}/><div className="space-y-6"><Fields values={[['Max exams list retrieve count','600'],['MWL plugin path','lastname,id; default value if not present']]}/><Radio label="Time column" options={['Acquisition time','Reception time']} /><Toggles values={['Uploader unit check','Associate all user-unit','Mailbox enabled']} checked={[false,false,true]} /></div></div>; }
function GdprPanel() { return <div className="grid gap-6 md:grid-cols-2"><Fields values={[['Max login attempts','3'],['Lockout minutes','5'],['Session expire minutes','60'],['Password: expiration days','90'],['Password: minimum length','8']]}/><Toggles values={['Password: Lowercase','Password: Symbol','Password: Uppercase']} checked={[false,false,true]} /></div>; }
function AuthenticationPanel() { return <div className="grid gap-8 md:grid-cols-2"><Fields values={[['User authentication provider','Local'],['Web services authentication provider','Local']]}/><div className="space-y-7"><Radio label="User authentication async services match" options={['Local db username','External user ID']} /><Toggles values={['User authentication fallback','Web services authentication fallback']} checked={[false,false]} /></div></div>; }
function SignPanel() { return <div className="grid gap-8 md:grid-cols-2"><Fields values={[['Signature provider name','Local'],['Appended signature statement','Local'],['Cache password timeout minutes','60']]}/><div className="space-y-6"><Fields values={[['Local session max duration minutes','5']]}/><Toggles values={['Cache password','Multiple signature']} checked={[false,true]} /></div></div>; }
function WebChatPanel() { return <div className="max-w-xl space-y-7"><Toggles values={['Enabled']} checked={[false]} /><Fields values={[['Identify code','local_desktop-eeog174']]}/></div>; }

function Fields({ values }: { values: [string, string][] }) { return <div className="space-y-5">{values.map(([label, value]) => <div key={label} className="space-y-2"><Label htmlFor={label}>{label}</Label><Input id={label} defaultValue={value} placeholder="Type here" /></div>)}</div>; }
function Toggles({ values, checked }: { values: string[]; checked: boolean[] }) { return <div className="space-y-5">{values.map((label, index) => <div key={label} className="flex items-center justify-between text-base font-medium text-foreground"><span>{label}</span><Switch defaultChecked={checked[index]} aria-label={label} /></div>)}</div>; }
function Radio({ label, options }: { label: string; options: string[] }) { return <fieldset><legend className="mb-3 text-base font-medium text-foreground">{label}</legend>{options.map((option, index) => <label key={option} className="mr-5 text-sm text-foreground"><input defaultChecked={index === 0} name={label} type="radio" className="mr-2 accent-primary" />{option}</label>)}</fieldset>; }
