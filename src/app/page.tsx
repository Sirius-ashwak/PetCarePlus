
"use client"; 

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { PawPrint, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default function LandingPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <PageHeader
        title="Welcome to PetCare+! 🐾"
        description="Your AI-powered companion for a healthier, happier pet. Manage profiles, check symptoms, and get dietary advice all in one place."
      />
      
      <Card className="w-full max-w-md shadow-xl my-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <PawPrint className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Get Started with PetCare+</CardTitle>
          <CardDescription className="text-center">
            Join our community of pet lovers today!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Link href="/signup" passHref>
            <Button className="w-full" size="lg">
              <UserPlus className="mr-2 h-5 w-5" /> Sign Up
            </Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant="outline" className="w-full" size="lg">
              <LogIn className="mr-2 h-5 w-5" /> Login
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="mt-10 grid gap-8 md:grid-cols-3 max-w-4xl w-full">
        <FeatureCard
          icon={<Image src="https://placehold.co/100x100.png" alt="Pet Profiles" width={60} height={60} className="rounded-lg" data-ai-hint="pet collage"/>}
          title="Organized Pet Profiles"
          description="Keep all your pet's vital information, health records, and cute photos in one secure place."
        />
        <FeatureCard
          icon={<Image src="https://placehold.co/100x100.png" alt="AI Symptom Checker" width={60} height={60} className="rounded-lg" data-ai-hint="veterinarian computer"/>}
          title="AI Symptom Insights"
          description="Worried about your pet? Get preliminary insights into potential issues with our AI-powered symptom checker."
        />
        <FeatureCard
          icon={<Image src="https://placehold.co/100x100.png" alt="Diet & Allergy Info" width={60} height={60} className="rounded-lg" data-ai-hint="healthy pet food"/>}
          title="Diet & Allergy Guides"
          description="Access comprehensive information on pet nutrition, common allergens, and safe food choices."
        />
      </div>

      <footer className="mt-16 text-sm text-muted-foreground">
        {currentYear !== null ? <p>&copy; {currentYear} PetCare+. All rights reserved.</p> : <p>&copy; PetCare+. All rights reserved.</p>}
        <p>Your trusted partner in pet care.</p>
      </footer>
    </div>
  );
}
