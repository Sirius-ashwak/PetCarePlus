
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
import { UserPlus, PawPrint } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Missing Fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    try {
      await signup(email, password, name);
      // Redirect is handled by AuthContext or useEffect in RootLayout
      toast({ title: "Signup Successful", description: "Welcome to PetCare+!" });
    } catch (error) {
      console.error("Signup failed:", error);
      toast({ title: "Signup Failed", description: (error as Error).message || "Could not create account. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute top-4 left-4">
        <Link href="/" passHref>
          <Button variant="outline"><PawPrint className="mr-2 h-4 w-4" /> Home</Button>
        </Link>
      </div>
      <PageHeader title="Create your PetCare+ Account" description="Join our community and start managing your pets today!" />
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserPlus className="h-6 w-6 text-primary"/>Sign Up</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={authLoading}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={authLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? "Creating Account..." : "Sign Up"}
            </Button>
            <CardDescription>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </CardDescription>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

