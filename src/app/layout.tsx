
"use client";

import type { Metadata } from 'next'; // Metadata can be defined in a server component if needed, or use dynamic metadata
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { AppDataProvider } from '@/contexts/app-data-context';
import { Toaster } from '@/components/ui/toaster';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ThemeProvider } from '@/components/theme-provider'; // Import ThemeProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Static metadata. For dynamic, a different approach might be needed or use generateMetadata
// export const metadata: Metadata = {
// title: 'PetCare+ - Your Pet Companion',
// description: 'AI-powered guide to healthier, happier pets.',
// };

function ConditionalLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const publicPaths = ['/', '/login', '/signup']; // '/' is now the landing page
  const isPublicPath = publicPaths.includes(pathname);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = isPublicPath ? 'PetCare+ - Welcome' : 'PetCare+ - App';
    }
  }, [isPublicPath, pathname]);

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicPath) {
        router.replace('/login');
      } else if (user && isPublicPath) {
        // If user is logged in and on a public page (like /login, /signup, or /), redirect to dashboard
        // Exception: if they are on '/' and it's the landing page, this is fine, but usually we redirect.
        // For this setup, if user is logged in, '/' should also redirect to '/dashboard'.
        router.replace('/dashboard');
      }
    }
  }, [user, loading, isPublicPath, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoadingSpinner size={48} />
        <p className="ml-4 text-muted-foreground">Loading PetCare+...</p>
      </div>
    );
  }

  if (isPublicPath) {
    // If it's a public path and the user is somehow still here (not yet redirected by useEffect), show children
    // This case implies either loading is true (handled above) or user is null (correct for public path)
     if (user) { 
        // This state should ideally be handled by the redirect in useEffect.
        // Shows loading while redirecting.
        return (
          <div className="flex h-screen w-screen items-center justify-center bg-background">
            <LoadingSpinner size={48} />
             <p className="ml-4 text-muted-foreground">Redirecting...</p>
          </div>
        );
     }
    return <>{children}</>;
  }

  // If not a public path, and not loading:
  if (!user) {
    // This state should also be handled by redirect in useEffect.
    // Shows loading while redirecting to /login.
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoadingSpinner size={48} />
        <p className="ml-4 text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  // User is authenticated, and it's a protected path
  return (
    <AppDataProvider>
      <AppLayout>
        {children}
      </AppLayout>
    </AppDataProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         {/* Default title, can be overridden by pages or ConditionalLayoutContent */}
        <title>PetCare+</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConditionalLayoutContent>
              {children}
            </ConditionalLayoutContent>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
