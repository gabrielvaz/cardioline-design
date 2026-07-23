import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "@cardioline/ui/src/styles/globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

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
    default: "Vireo Arc — Cardioline",
    template: "%s | Vireo Arc",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ee5b00" },
    { media: "(prefers-color-scheme: dark)", color: "#071046" },
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("cardioline-theme")?.value;
  const initialTheme = savedTheme === "dark" ? "dark" : "light";

  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${initialTheme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
