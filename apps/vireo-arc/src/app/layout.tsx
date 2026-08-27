import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "@cardioline/ui/src/styles/globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SessionProvider } from "@/lib/session";

/* Cardioline brand fonts — extracted from cardioline.com */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Vireo ARK — Cardioline",
    template: "%s | Vireo ARK",
  },
  description:
    "Advanced electrocardiogram and cardiac diagnostic platform. Powered by Cardioline.",
  keywords: [
    "ECG",
    "electrocardiogram",
    "cardiology",
    "Cardioline",
    "cardiac diagnostics",
  ],
  authors: [{ name: "Cardioline" }],
  /* No `icons` entry: a literal path would skip basePath. Next derives the
     link from `app/icon.svg` and prefixes it correctly. */
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ee5b00" },
    { media: "(prefers-color-scheme: dark)", color: "#071046" },
  ],
};

/**
 * The theme used to be resolved from a cookie on the server so the first paint
 * already carried the right class. A static export has no request to read, so
 * a blocking inline script does the same job from localStorage before the
 * browser paints — without it, dark-mode users get a white flash on every load.
 */
const themeBootstrap = `(function(){try{var t=localStorage.getItem("cardioline-theme");if(t!=="dark"&&t!=="light"){t="light"}document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t;var s=JSON.parse(localStorage.getItem("vireo-ark-session")||"{}");document.documentElement.dataset.density=s.density==="compact"?"compact":"comfortable"}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
