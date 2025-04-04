import Provider from "@/app/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://scistuai.com/"),
  title: {
    default: 'ScistuAI',
    template: `%s | ScistuAI`
  },
  description:
    "Your AI-powered academic assistant for scientific research and study optimization",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
  },
  openGraph: {
    description:
      "Transform your academic journey with ScistuAI - Your intelligent study companion for enhanced learning and research",
    images: [
      "/og-image.png"
    ],
    url: "https://scistuai.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScistuAI - Academic AI Assistant",
    description:
      "Transform your academic journey with ScistuAI - Your intelligent study companion for enhanced learning and research",
    creator: "@scistuai",
    images: [
      "/og-image.png"
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </Provider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
