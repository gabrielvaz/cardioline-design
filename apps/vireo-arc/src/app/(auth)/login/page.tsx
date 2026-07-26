import type { Metadata } from 'next';
import { BrandPanel } from '@/components/auth/brand-panel';
import { LoginForm } from '@/components/auth/login-form';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Vireo Arc — Cardioline cardiac diagnostic platform.',
};

export default function LoginPage() {
  return (
    <main id="login-main" className="grid min-h-screen bg-background lg:grid-cols-2">
      <BrandPanel />
      <div className="flex items-center justify-center px-6 py-12">
        <LoginForm />
      </div>
      <ThemeToggle />
    </main>
  );
}
