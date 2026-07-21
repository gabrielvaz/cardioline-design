import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Vireo Arc — Cardioline cardiac diagnostic platform.',
};

export default function LoginPage() {
  return (
    <main
      id="login-main"
      className="relative min-h-screen flex items-center justify-center bg-white"
    >
      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <LoginForm />
      </div>
    </main>
  );
}
