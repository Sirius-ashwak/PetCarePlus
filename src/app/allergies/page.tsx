
"use client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { dietDatabase, type PetDietInfo, type DietInfoCategory } from "@/lib/data/diet-info";
import { PawPrint, AlertTriangle, CheckCircle, XCircle, BookOpen } from "lucide-react";

const CategoryCard: React.FC<{ category: DietInfoCategory, icon: React.ElementType, iconColorClass: string }> = ({ category, icon: Icon, iconColorClass }) => (
  <Card className="mb-4 shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center text-lg">
        <Icon className={`mr-2 h-5 w-5 ${iconColorClass}`} />
        {category.title}
      </CardTitle>
      {category.description && <CardDescription>{category.description}</CardDescription>}
    </CardHeader>
    <CardContent>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {category.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const DietInfoSection: React.FC<{ info: PetDietInfo }> = ({ info }) => (
  <div className="space-y-6">
    <CategoryCard category={info.commonAllergens} icon={AlertTriangle} iconColorClass="text-amber-500" />
    <CategoryCard category={info.safeFoods} icon={CheckCircle} iconColorClass="text-green-500" />
    <CategoryCard category={info.unsafeFoods} icon={XCircle} iconColorClass="text-red-500" />
    
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <BookOpen className="mr-2 h-5 w-5 text-primary" />
          General Diet Tips for {info.petType}s
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {info.generalDietTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default function AllergiesPage() {
  return (
    <>
      <PageHeader
        title="Pet Allergies & Diet Information"
        description="Learn about common food sensitivities and safe dietary choices for your pets. Always consult your vet for specific advice."
      />
      <Accordion type="single" collapsible className="w-full space-y-4">
        {dietDatabase.map((petInfo) => (
          <AccordionItem value={petInfo.petType.toLowerCase()} key={petInfo.petType} className="border bg-card rounded-lg shadow-md">
            <AccordionTrigger className="p-4 text-xl font-semibold hover:no-underline">
              <div className="flex items-center">
                <PawPrint className="mr-3 h-6 w-6 text-primary" />
                {petInfo.petType} Nutrition Guide
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <DietInfoSection info={petInfo} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-destructive"/>Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The information provided on this page is for general knowledge and informational purposes only, and does not constitute medical advice. It is essential to consult with a qualified veterinarian for any health concerns or before making any decisions related to your pet's health or treatment. Every pet is an individual, and dietary needs can vary based on breed, age, health status, and other factors.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
