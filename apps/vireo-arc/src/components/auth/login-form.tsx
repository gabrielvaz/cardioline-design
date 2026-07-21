'use client';

import * as React from 'react';
import { Eye, EyeOff, Activity, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@cardioline/ui';

/* ─── Inline glass-style Input ──────────────────────────────── */
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 ring-offset-transparent backdrop-blur-sm transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5b00] focus-visible:border-[#ee5b00]/60',
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
      className={cn('text-xs font-medium text-white/70 uppercase tracking-wider', className)}
      {...props}
    />
  );
}

/* ─── Vireo Arc Logo Mark ────────────────────────────────────── */
function VireoArcLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#ee5b00] to-[#ff7d38] shadow-lg">
        <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
        {/* Navy accent dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#071046] border-2 border-[#071046]" />
      </div>
      <div>
        <p className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">
          Cardioline
        </p>
        <p className="text-lg font-bold text-white leading-none font-heading tracking-tight">
          Vireo Arc
        </p>
      </div>
    </div>
  );
}

/* ─── ECG SVG Divider ────────────────────────────────────────── */
function EcgDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-white/10" />
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
      <div className="flex-1 h-px bg-white/10" />
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
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(7, 16, 70, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(238, 91, 0, 0.15)',
      }}
    >
      {/* Top gradient accent line */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(238,91,0,0.9) 30%, rgba(238,91,0,0.5) 70%, transparent)',
        }}
        aria-hidden="true"
      />

      <div className="p-8">
        {/* Logo */}
        <VireoArcLogo />

        <EcgDivider />

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-heading leading-tight">
            Welcome back
          </h1>
          <p className="text-sm text-white/50 mt-1">
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
                className="text-xs text-[#ff7d38] hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors focus-visible:outline-none"
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
              className="flex items-center gap-2 rounded-lg bg-[#ee5b00]/10 border border-[#ee5b00]/30 px-4 py-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ee5b00] flex-shrink-0" />
              <p className="text-xs text-[#ff9d6a]">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={isLoading}
            className={cn(
              'relative w-full h-12 rounded-lg font-semibold text-sm text-white overflow-hidden group',
              'transition-all duration-200 active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5b00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071046]',
              'disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100',
              'bg-gradient-to-r from-[#ee5b00] to-[#ff7d38]',
              'hover:from-[#d44e00] hover:to-[#ee5b00]',
              'shadow-[0_4px_24px_-4px_rgba(238,91,0,0.5)]'
            )}
          >
            {/* Shimmer on hover */}
            {!isLoading && (
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            )}

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

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-white/30 leading-relaxed">
              Certified platform for clinical<br />and diagnostic environments
            </p>
            {/* System status badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#ee5b00]/30 bg-[#ee5b00]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ee5b00] animate-pulse" />
              <span className="text-[10px] font-medium text-[#ff9d6a] tracking-wide">
                SYSTEM ACTIVE
              </span>
            </div>
          </div>

          {/* Attribution */}
          <p className="text-center text-[10px] text-white/20 mt-5 tracking-widest uppercase">
            Powered by Cardioline S.P.A.
          </p>
        </div>
      </div>
    </div>
  );
}
