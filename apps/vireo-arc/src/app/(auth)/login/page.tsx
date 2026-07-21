import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import { EcgBackground } from '@/components/ui/ecg-background';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Vireo Arc — Cardioline cardiac diagnostic platform.',
};

export default function LoginPage() {
  return (
    <main
      id="login-main"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#071046]"
    >
      {/* Animated ECG waveform background */}
      <EcgBackground />

      {/* Radial gradient overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(238,91,0,0.20) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 50%, rgba(7,16,70,0.8) 0%, transparent 70%)',
        }}
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <LoginForm />
      </div>
    </main>
  );
}
