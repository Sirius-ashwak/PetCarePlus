
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, PawPrint } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing Fields", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }
    try {
      await login(email, password);
      // Redirect is handled by AuthContext or useEffect in RootLayout
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error) {
      console.error("Login failed:", error);
      toast({ title: "Login Failed", description: (error as Error).message || "Invalid credentials. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute top-4 left-4">
        <Link href="/" passHref>
          <Button variant="outline"><PawPrint className="mr-2 h-4 w-4" /> Home</Button>
        </Link>
      </div>
      <PageHeader title="Login to PetCare+" description="Access your pet profiles and our AI tools." />
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LogIn className="h-6 w-6 text-primary"/>Enter Your Credentials</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={authLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={authLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? "Logging in..." : "Login"}
            </Button>
            <CardDescription>
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </CardDescription>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
