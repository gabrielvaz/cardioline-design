'use client';

import * as React from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Button, Input, Label } from '@cardioline/ui';
import { useRouter } from 'next/navigation';

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
    <div className="w-full max-w-sm">
      {/* Brand signature, visible only when the brand panel is hidden. */}
      <div className="mb-10 flex justify-center lg:hidden">
        <Image
          src="/brand/vireo-ark.svg"
          alt="Vireo ARK"
          width={390}
          height={67}
          priority
          className="h-7 w-auto dark:hidden"
        />
        <Image
          src="/brand/vireo-ark-white.svg"
          alt="Vireo ARK"
          width={390}
          height={67}
          priority
          className="hidden h-7 w-auto dark:block"
        />
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access the Vireo ARK diagnostic workspace.
        </p>
      </div>

      {/* Form */}
      <form
        id="login-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        {/* Email */}
        <div className="space-y-2">
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
            className="h-11"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              id="forgot-password-link"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:underline"
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
              className="h-11 pr-11"
              aria-required="true"
            />
            <button
              type="button"
              id="toggle-password-visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
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
            className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3"
          >
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive" />
            <p className="text-xs font-medium text-destructive">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <Button
          id="login-submit-button"
          type="submit"
          disabled={isLoading}
          className="h-11 w-full text-sm font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer — below `lg` the brand panel is hidden, so this is the only
          place the Cardioline mark appears.  Rendered as the actual logo. */}
      <div className="mt-10 flex flex-col items-center gap-2.5">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Powered by
        </p>
        <Image
          src="https://cardioline.com/wp-content/uploads/2022/08/logo.png"
          alt="Cardioline S.p.A."
          width={600}
          height={38}
          sizes="256px"
          className="h-4 w-auto"
        />
      </div>
    </div>
  );
}
