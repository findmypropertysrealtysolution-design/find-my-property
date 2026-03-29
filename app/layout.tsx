import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProviders } from "@/components/app-providers";
import { cn } from "@/lib/utils";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased",
          fontSans.variable,
          fontHeading.variable,
          "font-[family-name:var(--font-body)]",
        )}
      >
        <ThemeProvider>
          <AppProviders>{children}</AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
