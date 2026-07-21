import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import { EcgBackground } from '@/components/ui/ecg-background';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Acesse a plataforma Vireo Arc de diagnóstico cardíaco da Cardioline.',
};

export default function LoginPage() {
  return (
    <main
      id="login-main"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b1529]"
    >
      {/* Animated ECG background */}
      <EcgBackground />

      {/* Gradient overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(24,64,162,0.35) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 50%, rgba(17,31,71,0.6) 0%, transparent 70%)',
        }}
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <LoginForm />
      </div>
    </main>
  );
}
