'use client';

import * as React from 'react';
import { Eye, EyeOff, Activity, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@cardioline/ui';

/* ─── Inline ShadCN-compatible components (avoids SSR issues) ── */

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 ring-offset-transparent backdrop-blur-sm transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6ae0] focus-visible:border-[#2d6ae0]/60',
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

/* ─── Cardioline Logo Mark ───────────────────────────────────── */
function CardiolineLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Heart icon with pulse */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1840a2] to-[#2d6ae0] shadow-lg">
        <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
        {/* Red accent dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#f83b3b] border-2 border-[#0b1529]" />
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

/* ─── ECG Divider ────────────────────────────────────────────── */
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
          stroke="#f83b3b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.7"
        />
      </svg>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

/* ─── Login Form ─────────────────────────────────────────────── */
export function LoginForm() {
  const [email, setEmail]           = React.useState('');
  const [password, setPassword]     = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading]   = React.useState(false);
  const [error, setError]           = React.useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos para continuar.');
      return;
    }

    setIsLoading(true);
    /* Simulate auth — replace with real auth logic */
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    /* TODO: navigate to dashboard */
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(11, 21, 41, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(45, 106, 224, 0.15)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(45,106,224,0.8) 30%, rgba(248,59,59,0.6) 70%, transparent)',
        }}
        aria-hidden="true"
      />

      <div className="p-8">
        {/* Logo */}
        <CardiolineLogo />

        <EcgDivider />

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-heading leading-tight">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Acesse sua conta para continuar a diagnóstico cardíaco.
          </p>
        </div>

        {/* Form */}
        <form
          id="login-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {/* Email field */}
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="clinico@hospital.com.br"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <button
                type="button"
                id="forgot-password-link"
                className="text-xs text-[#5891ff] hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                onClick={() => {/* TODO */}}
              >
                Esqueceu a senha?
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
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
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
              className="flex items-center gap-2 rounded-lg bg-[#f83b3b]/10 border border-[#f83b3b]/30 px-4 py-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#f83b3b] flex-shrink-0" />
              <p className="text-xs text-[#ff8080]">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={isLoading}
            className={cn(
              'relative w-full h-12 rounded-lg font-semibold text-sm text-white overflow-hidden group',
              'transition-all duration-200 active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6ae0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1529]',
              'disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100',
              'bg-gradient-to-r from-[#1840a2] to-[#2d6ae0]',
              'hover:from-[#1840a2]/90 hover:to-[#3d7bf5]',
              'shadow-[0_4px_24px_-4px_rgba(45,106,224,0.5)]'
            )}
          >
            {/* Shimmer effect */}
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
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar
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
              Plataforma certificada para uso<br />em ambientes clínicos
            </p>
            {/* Medical-grade badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#2d6ae0]/30 bg-[#2d6ae0]/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d6ae0] animate-pulse" />
              <span className="text-[10px] font-medium text-[#5891ff] tracking-wide">
                SISTEMA ATIVO
              </span>
            </div>
          </div>

          {/* Cardioline attribution */}
          <p className="text-center text-[10px] text-white/20 mt-5 tracking-widest uppercase">
            Powered by Cardioline S.P.A.
          </p>
        </div>
      </div>
    </div>
  );
}
