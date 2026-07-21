import type { Metadata } from 'next';
import { Inter, DM_Sans, JetBrains_Mono } from 'next/font/google';
import '@cardioline/ui/src/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: {
    default: 'Vireo Arc — Cardioline',
    template: '%s | Vireo Arc',
  },
  description:
    'Plataforma avançada de eletrocardiograma e diagnóstico cardíaco. Powered by Cardioline.',
  keywords: ['ECG', 'eletrocardiograma', 'cardiologia', 'Cardioline', 'diagnóstico cardíaco'],
  authors: [{ name: 'Cardioline' }],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1840a2' },
    { media: '(prefers-color-scheme: dark)',  color: '#111f47' },
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
