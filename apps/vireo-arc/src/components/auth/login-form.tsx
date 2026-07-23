'use client';

import * as React from 'react';
import { Eye, EyeOff, Loader2, ArrowRight, Moon, Sun } from 'lucide-react';
import { Button, cn } from '@cardioline/ui';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme/theme-provider';

/* ─── Clean Light-themed Input ──────────────────────────────── */
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5b00]/20 focus-visible:border-[#ee5b00]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-xs font-semibold text-gray-700 uppercase tracking-wider', className)}
      {...props}
    />
  );
}

/* ─── Official Cardioline Logo ───────────────────────────────── */
function CardiolineLogo() {
  return (
    <div className="mt-4 flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="https://cardioline.com/wp-content/uploads/2022/08/logo.png" 
        alt="Cardioline Logo" 
        className="h-3.5 w-auto object-contain"
      />
    </div>
  );
}

/* ─── Login Form ─────────────────────────────────────────────── */
export function LoginForm() {
  const [email, setEmail]               = React.useState('');
  const [password, setPassword]         = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading]       = React.useState(false);
  const [error, setError]               = React.useState('');
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields to continue.');
      return;
    }

    setIsLoading(true);
    /* TODO: replace with real authentication logic */
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    router.push('/dashboard');
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-px"
      style={{
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Slow moving brand accent, visible only as the card border. */}
      <div
        className="login-border-orbit pointer-events-none absolute -inset-[120%]"
        aria-hidden="true"
      />

      <div className="relative rounded-[15px] bg-white p-16">
        {/* Product wordmark follows the same signature used in the sidebar. */}
        <div className="mb-8 text-center">
          <p className="font-heading text-2xl font-bold tracking-[0.12em] text-accent">
            Vireo <span className="text-primary">ARC</span>
          </p>
          <CardiolineLogo />
        </div>

        {/* Form */}
        <form
          id="login-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="clinician@hospital.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                id="forgot-password-link"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:underline"
                onClick={() => router.push('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-11"
                aria-required="true"
              />
              <button
                type="button"
                id="toggle-password-visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              id="login-error"
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={isLoading}
            className={cn(
              'relative w-full h-12 rounded-lg font-semibold text-sm text-white overflow-hidden group mt-2',
              'transition-all duration-200 active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5b00] focus-visible:ring-offset-2',
              'disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100',
              'bg-primary',
              'shadow-sm shadow-[#ee5b00]/20'
            )}
          >
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer (Cleaned up, no badge) */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-center text-[10px] text-gray-400 font-medium tracking-widest uppercase">
            Powered by Cardioline S.P.A.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
        className="fixed bottom-6 right-6 z-20 rounded-full bg-card shadow-md"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun /> : <Moon />}
      </Button>

      <style jsx>{`
        .login-border-orbit {
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            hsl(var(--primary) / 0.12) 80deg,
            hsl(var(--primary) / 0.9) 145deg,
            hsl(var(--primary) / 0.2) 210deg,
            transparent 290deg
          );
          animation: login-border-orbit 14s linear infinite;
        }

        @keyframes login-border-orbit {
          to {
            transform: rotate(1turn);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-border-orbit {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
