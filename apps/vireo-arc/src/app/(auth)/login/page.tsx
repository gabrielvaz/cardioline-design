import type { Metadata } from 'next';
import { BrandPanel } from '@/components/auth/brand-panel';
import { LoginForm } from '@/components/auth/login-form';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Vireo ARK — Cardioline cardiac diagnostic platform.',
};

export default function LoginPage() {
  return (
    <main id="login-main" className="grid min-h-screen bg-background lg:grid-cols-2">
      <BrandPanel />
      {/* `min-w-0`: a grid item defaults to `min-width: auto`, which stopped
          the form shrinking below its own max-width and pushed the page wider
          than the phone viewport. */}
      <div className="flex min-w-0 items-center justify-center px-5 py-10 sm:px-6 sm:py-12">
        <LoginForm />
      </div>
      <ThemeToggle />
    </main>
  );
}
