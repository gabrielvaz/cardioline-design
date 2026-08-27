'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { Button, ConfirmDialog, Input, Label, cn } from '@cardioline/ui';
import { asset } from '@/lib/asset';
import { useSession } from '@/lib/session';
import { roleById } from '@/lib/roles';
import { useProfiles, type Profile } from '@/lib/profiles';

/**
 * Sign-in. Two ways in: pick one of the demo accounts, or type an address.
 *
 * Authentication is mocked — any password is accepted — but the password step
 * is real, because choosing an account and then being let straight in would
 * not be the interaction we are validating.
 *
 * Either path leads to the first-login setup: while this is a prototype, every
 * sign-in runs it again so each persona can be tried quickly.
 */
export function LoginForm() {
  const router = useRouter();
  const { setRole } = useSession();
  const { hydrated, profiles, remove } = useProfiles();

  const [selected, setSelected] = React.useState<Profile | null>(null);
  const [useCredentials, setUseCredentials] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<Profile | null>(null);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const passwordRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (selected) passwordRef.current?.focus();
  }, [selected]);

  const reset = () => {
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  async function signIn(profile: Profile | null) {
    setError('');
    if (!password || (!profile && !email)) {
      setError('Please fill in all fields to continue.');
      return;
    }
    setIsLoading(true);
    /* TODO: replace with real authentication logic */
    await new Promise((r) => setTimeout(r, 900));
    /* Picking an account seeds the setup with that account's role; the user
       still confirms or changes it on the first step. */
    if (profile) setRole(profile.roleId);
    setIsLoading(false);
    router.push('/setup');
  }

  const heading = selected
    ? { title: `Welcome back, ${selected.name.split(' ').slice(-1)[0]}`, lead: 'Enter your password to continue.' }
    : useCredentials
      ? { title: 'Sign in', lead: 'Access the Vireo ARK diagnostic workspace.' }
      : { title: 'Choose your account', lead: 'Or sign in with an email address.' };

  return (
    <div className="w-full max-w-sm">
      {/* Brand signature, visible only when the brand panel is hidden. */}
      <div className="mb-10 flex justify-center lg:hidden">
        <Image src={asset('/brand/vireo-ark.svg')} alt="Vireo ARK" width={390} height={67} priority className="h-7 w-auto dark:hidden" />
        <Image src={asset('/brand/vireo-ark-white.svg')} alt="Vireo ARK" width={390} height={67} priority className="hidden h-7 w-auto dark:block" />
      </div>

      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">{heading.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{heading.lead}</p>
      </div>

      {/* ── Account picker ── */}
      {!selected && !useCredentials && (
        <div className="space-y-4">
          <ul className="space-y-2">
            {hydrated &&
              profiles.map((profile) => (
                <li key={profile.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setSelected(profile);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 pr-11 text-left transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold', profile.tone)}>
                      {profile.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">{profile.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {roleById(profile.roleId)?.name} · {profile.title}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${profile.name} from this device`}
                    onClick={() => setPendingDelete(profile)}
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
          </ul>

          {hydrated && profiles.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
              No saved accounts on this device.
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              reset();
              setUseCredentials(true);
            }}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:underline focus-visible:outline-none"
          >
            Sign in with an email address
          </button>
        </div>
      )}

      {/* ── Password for the picked account ── */}
      {selected && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void signIn(selected);
          }}
          noValidate
          className="space-y-5"
        >
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
            <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold', selected.tone)}>
              {selected.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{selected.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {roleById(selected.roleId)?.name} · {selected.title}
              </span>
            </span>
          </div>

          <PasswordField
            ref={passwordRef}
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
          {error && <ErrorNote>{error}</ErrorNote>}

          <Button type="submit" disabled={isLoading} className="h-11 w-full text-sm font-semibold">
            {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Signing in...</>) : (<>Sign In<ArrowRight className="h-4 w-4" /></>)}
          </Button>
          <button
            type="button"
            onClick={() => {
              reset();
              setSelected(null);
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:underline focus-visible:outline-none"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Choose another account
          </button>
        </form>
      )}

      {/* ── Email and password ── */}
      {useCredentials && !selected && (
        <form
          id="login-form"
          onSubmit={(event) => {
            event.preventDefault();
            void signIn(null);
          }}
          noValidate
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="clinician@hospital.com"
              /* Autofill is off throughout: this is a demo account screen and a
                 browser offering saved credentials only gets in the way. */
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-1p-ignore
              data-lpignore="true"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true"
              aria-describedby={error ? 'login-error' : undefined}
              className="h-11"
            />
          </div>

          <PasswordField
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            onForgot={() => router.push('/forgot-password')}
          />
          {error && <ErrorNote>{error}</ErrorNote>}

          <Button id="login-submit-button" type="submit" disabled={isLoading} className="h-11 w-full text-sm font-semibold">
            {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Signing in...</>) : (<>Sign In<ArrowRight className="h-4 w-4" /></>)}
          </Button>
          <button
            type="button"
            onClick={() => {
              reset();
              setUseCredentials(false);
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:underline focus-visible:outline-none"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to accounts
          </button>
        </form>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove account"
        description={`${pendingDelete?.name ?? 'This account'} will no longer appear on this sign-in screen. Nothing about the account itself is deleted, and an administrator can still reach it.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) remove(pendingDelete.id);
          setPendingDelete(null);
        }}
      />

      {/* Footer — `lg:hidden` because the brand panel already carries the
          Cardioline mark from `lg` up, and two of them on one screen read as a
          mistake. Below `lg` the panel is gone and this is the only one. */}
      <div className="mt-10 flex flex-col items-center gap-2.5 lg:hidden">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Powered by</p>
        <Image src="https://cardioline.com/wp-content/uploads/2022/08/logo.png" alt="Cardioline S.p.A." width={600} height={38} sizes="256px" className="h-4 w-auto" />
      </div>
    </div>
  );
}

const PasswordField = React.forwardRef<
  HTMLInputElement,
  {
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    onToggle: () => void;
    onForgot?: () => void;
  }
>(function PasswordField({ value, onChange, show, onToggle, onForgot }, ref) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="password">Password</Label>
        {onForgot && (
          <button
            type="button"
            id="forgot-password-link"
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80 focus-visible:underline focus-visible:outline-none"
            onClick={onForgot}
          >
            Forgot password?
          </button>
        )}
      </div>
      <div className="relative">
        <Input
          ref={ref}
          id="password"
          type={show ? 'text' : 'password'}
          name="password"
          placeholder="••••••••"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 pr-11"
          aria-required="true"
        />
        <button
          type="button"
          id="toggle-password-visibility"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
          onClick={onToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
});

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div id="login-error" role="alert" aria-live="polite" className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3">
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive" />
      <p className="text-xs font-medium text-destructive">{children}</p>
    </div>
  );
}
