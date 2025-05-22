
"use client"; 

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, Stethoscope, ListChecks, Sparkles, ScanSearch, BellRing, Mic, AlertTriangle as EmergencyIcon } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Welcome Back to PetCare+! 🐾"
        description="Your AI-powered companion for a healthier, happier pet."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-6 w-6 text-primary" />
              Pet Profiles
            </CardTitle>
            <CardDescription>Manage your pet's information, health records, and daily logs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pets" passHref>
              <Button className="w-full">Manage Pets</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-6 w-6 text-primary" />
              Pet Reminders
            </CardTitle>
            <CardDescription>Schedule and track feeding times, walks, medications, and appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reminders" passHref>
              <Button className="w-full">View Reminders</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EmergencyIcon className="h-6 w-6 text-primary" />
              Emergency Info
            </CardTitle>
            <CardDescription>Access saved emergency contacts and information quickly.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/emergency" passHref>
              <Button className="w-full">View Contacts</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              AI Symptom Checker
            </CardTitle>
            <CardDescription>Get AI-powered insights into your pet's symptoms. Not a vet replacement.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/symptom-checker" passHref>
              <Button className="w-full">Check Symptoms</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-primary" />
              Allergies & Diet Info
            </CardTitle>
            <CardDescription>Learn about common allergens and safe foods for your furry friends.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/allergies" passHref>
              <Button className="w-full">View Info</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              AI Pet Name Generator
            </CardTitle>
            <CardDescription>Find the perfect name for your new companion with AI suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools/pet-name-generator" passHref>
              <Button className="w-full">Find Names</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanSearch className="h-6 w-6 text-primary" />
              AI Breed Identifier
            </CardTitle>
            <CardDescription>Upload a pet photo to identify its breed and learn more.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools/breed-identifier" passHref>
              <Button className="w-full">Identify Breed</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-primary" />
              AI Voice Assistant
            </CardTitle>
            <CardDescription>Ask "Pal" your pet care questions via (simulated) voice.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools/voice-assistant" passHref>
              <Button className="w-full">Ask Pal</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-3">More Coming Soon!</h2>
        <p className="text-muted-foreground">
          We're working hard to bring you even more features to help you care for your beloved pets!
        </p>
      </div>
    </div>
  );
}
