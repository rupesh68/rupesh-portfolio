import { Schibsted_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SiteNavigation } from '@/components/SiteNavigation';
import { SiteFooter } from '@/components/SiteFooter';

const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-schibsted-grotesk',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata = {
  title: 'Rupesh Mahajan - Full Stack Developer',
  description:
    'Portfolio of Rupesh Mahajan, Full Stack Developer building thoughtful web interfaces and products.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${schibstedGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground antialiased selection:bg-foreground/10">
        <ThemeProvider>
          <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 sm:px-8">
            <SiteNavigation />
            <main className="flex-1 space-y-14 py-8 sm:space-y-16 sm:py-12">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
