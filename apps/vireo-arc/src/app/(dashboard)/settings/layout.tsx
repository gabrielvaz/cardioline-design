import { Card } from '@cardioline/ui';
import { SettingsNavigation } from '@/components/settings/settings-navigation';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <div><div className="mb-6"><h1 className="text-2xl font-bold text-[#071046]">Settings</h1><p className="mt-1 text-sm text-gray-500">Account, configuration and administration.</p></div><Card className="overflow-hidden border-gray-200 bg-white shadow-sm"><div className="flex min-h-[640px] flex-col md:flex-row"><SettingsNavigation /><div className="min-w-0 flex-1 p-6 md:p-8">{children}</div></div></Card></div>;
}
