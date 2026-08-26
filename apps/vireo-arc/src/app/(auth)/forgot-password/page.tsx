'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { Button, Input, Label } from '@cardioline/ui';
import { BrandPanel } from '@/components/auth/brand-panel';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { asset } from "@/lib/asset";

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <BrandPanel />
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Brand signature, visible only when the brand panel is hidden. */}
          <div className="mb-10 flex justify-center lg:hidden">
            <Image
              src={asset("/brand/vireo-ark.svg")}
              alt="Vireo ARK"
              width={390}
              height={67}
              priority
              className="h-7 w-auto dark:hidden"
            />
            <Image
              src={asset("/brand/vireo-ark-white.svg")}
              alt="Vireo ARK"
              width={390}
              height={67}
              priority
              className="hidden h-7 w-auto dark:block"
            />
          </div>

          {sent ? (
            <div className="space-y-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">
                  Check your inbox
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  A password-reset link was sent for this prototype account.
                </p>
              </div>
              <Button asChild className="h-11 w-full text-sm font-semibold">
                <Link href="/login">Return to sign in</Link>
              </Button>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <div className="mb-8">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  Forgot password?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email and we will send a reset link.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  required
                  type="email"
                  placeholder="clinician@hospital.com"
                  autoComplete="email"
                  className="h-11"
                />
              </div>

              <Button type="submit" className="h-11 w-full text-sm font-semibold">
                <Mail className="h-4 w-4" />
                Send reset link
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
      <ThemeToggle />
    </main>
  );
}
