import { Card } from '@cardioline/ui';
import { SettingsNavigation } from '@/components/settings/settings-navigation';
import { PageHeader } from '@/components/ui/page-header';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <div><PageHeader className="mb-6" title="Settings" description="Account, configuration and administration." /><Card className="overflow-hidden border-gray-200 bg-white shadow-sm"><div className="flex min-h-[640px] flex-col md:flex-row"><SettingsNavigation /><div className="min-w-0 flex-1 p-6 md:p-8">{children}</div></div></Card></div>;
}
