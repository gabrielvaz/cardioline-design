'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { Button, Input, Label } from '@cardioline/ui';

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  return <main className="flex min-h-screen items-center justify-center bg-white px-6"><section className="w-full max-w-md rounded-2xl border border-orange-100 bg-white p-8 shadow-xl shadow-gray-200/40"><div className="mb-8 text-center"><img src="https://cardioline.com/wp-content/uploads/2022/08/logo.png" alt="Cardioline Logo" className="mx-auto h-8 w-auto" /><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#071046]/50">Platform</p><h1 className="mt-1 text-xl font-bold text-[#071046]">Vireo Arc</h1></div>{sent ? <div className="space-y-5 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-green-600" /><div><h2 className="font-semibold text-gray-900">Check your inbox</h2><p className="mt-2 text-sm text-gray-500">A password-reset link was sent for this prototype account.</p></div><Button asChild className="w-full bg-[#ee5b00] text-white"><Link href="/login">Return to sign in</Link></Button></div> : <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><div><h2 className="text-lg font-semibold text-[#071046]">Forgot password?</h2><p className="mt-1 text-sm text-gray-500">Enter your email and we will send a reset link.</p></div><div className="space-y-2"><Label htmlFor="reset-email">Email</Label><Input id="reset-email" required type="email" placeholder="clinician@hospital.com" className="border-gray-300" /></div><Button type="submit" className="w-full bg-[#ee5b00] text-white hover:bg-[#d44e00]"><Mail className="mr-2" />Send reset link</Button><Link href="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-[#ee5b00]"><ArrowLeft className="h-4 w-4" />Back to sign in</Link></form>}</section></main>;
}
