'use client';

import * as React from 'react';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@cardioline/ui';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
    <div className="flex justify-center mb-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="https://cardioline.com/wp-content/uploads/2022/08/logo.png" 
        alt="Cardioline Logo" 
        className="h-8 w-auto object-contain"
      />
    </div>
  );
}

/* ─── Light ECG SVG Divider ──────────────────────────────────── */
function EcgDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-gray-100" />
      <svg
        width="80"
        height="20"
        viewBox="0 0 80 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <polyline
          points="0,10 15,10 20,4 23,16 26,2 29,18 32,10 47,10 52,4 55,16 58,2 61,18 64,10 80,10"
          stroke="#ee5b00"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.8"
        />
      </svg>
      <div className="flex-1 h-px bg-gray-100" />
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
      className="relative rounded-2xl overflow-hidden bg-white"
      style={{
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(238, 91, 0, 0.15)',
      }}
    >
      {/* Top gradient accent line (kept as requested) */}
      <div
        className="absolute top-0 inset-x-0 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(238,91,0,0.9) 30%, rgba(238,91,0,0.5) 70%, transparent)',
        }}
        aria-hidden="true"
      />

      <div className="p-8">
        {/* Logo */}
        <CardiolineLogo />
        
        {/* App Name */}
        <div className="text-center mt-3">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#071046]/50 uppercase">
            Platform
          </p>
          <p className="text-xl font-bold text-[#071046] leading-none font-heading tracking-tight mt-1">
            Vireo Arc
          </p>
        </div>

        <EcgDivider />

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#071046] font-heading leading-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your account to access cardiac diagnostics.
          </p>
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
                className="text-xs font-medium text-[#ee5b00] hover:text-[#d44e00] transition-colors focus-visible:outline-none focus-visible:underline"
                onClick={() => { /* TODO: navigate to forgot password */ }}
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
              'bg-[#ee5b00] hover:bg-[#d44e00]',
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
    </div>
  );
}
