
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, LocateFixed, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

declare global {
  interface Window {
    initMap?: () => void;
    google?: typeof google;
  }
}

export default function VetLocatorPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setMapError("Google Maps API key is missing. Please configure it in your environment variables.");
      setIsLoadingMap(false);
      return;
    }

    const scriptId = "google-maps-script";

    if (window.google && window.google.maps) {
      if (!isApiLoaded) setIsApiLoaded(true); // Ensure state is correct if loaded by other means
      return;
    }

    if (document.getElementById(scriptId)) {
      // Script tag exists, assume it's loading or has loaded.
      // If window.google.maps is not yet available, initMap callback should handle it.
      // If initMap was already called, isApiLoaded would be true.
      // This state can be complex if multiple instances try to load.
      // A simple check: if window.initMap is defined, it means this or another instance is managing.
      return;
    }

    window.initMap = () => {
      setIsApiLoaded(true);
      delete window.initMap; // Clean up after execution
    };

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places`; // Added places library
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setMapError("Failed to load Google Maps script. Please check your API key and network connection.");
      setIsLoadingMap(false);
      if(window.initMap) delete window.initMap;
    };
    document.head.appendChild(script);

    return () => {
      // More careful cleanup: only remove script if this component instance added it AND it hasn't loaded
      const existingScript = document.getElementById(scriptId);
      if (existingScript && !window.google?.maps) {
        existingScript.remove();
      }
      // If the component unmounts and its specific initMap hasn't run and been deleted, clean it up.
      // This is still a simplification; a robust script loader hook is better for complex apps.
      if (window.initMap && typeof window.initMap === 'function' && !isApiLoaded) {
         // delete window.initMap; // Be cautious with deleting global if other components might rely on it.
      }
    };
  }, [apiKey, isApiLoaded]);

  useEffect(() => {
    if (isApiLoaded && mapRef.current && !mapInstance) {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.0902, lng: -95.7129 }, // Center of USA
          zoom: 4,
          mapId: "PETPAL_VET_LOCATOR_MAP" 
        });
        setMapInstance(map);
        setIsLoadingMap(false);
        setMapError(null);
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError("Could not initialize the map.");
        setIsLoadingMap(false);
      }
    }
  }, [isApiLoaded, mapInstance]);


  return (
    <>
      <PageHeader
        title="Vet Locator"
        description="Find nearby veterinary clinics and emergency hospitals."
        actions={
            <Link href="/emergency">
                <Button variant="outline">Back to Emergency</Button>
            </Link>
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-primary"/>Search Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="locationSearch" className="block text-sm font-medium text-muted-foreground mb-1">
                  Enter Address or Zip Code
                </label>
                <Input id="locationSearch" type="text" placeholder="e.g., 123 Main St or 90210" disabled />
              </div>
              <Button className="w-full" disabled>
                <Search className="mr-2 h-4 w-4" /> Search (Coming Soon)
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <LocateFixed className="mr-2 h-4 w-4" /> Use My Location (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg"> {/* Removed min-h-[400px] here */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <MapPin className="h-6 w-6 text-primary"/> Nearby Vets
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative" style={{ height: '400px' }}> {/* Set height directly here */}
              {isLoadingMap && !mapError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 rounded-b-lg">
                  <LoadingSpinner size={48} />
                  <p className="mt-2 text-muted-foreground">Loading map...</p>
                </div>
              )}
              {mapError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 z-10 rounded-b-lg">
                    <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
                    <p className="text-destructive text-center font-semibold">Map Error</p>
                    <p className="text-muted-foreground text-center text-sm">{mapError}</p>
                </div>
              )}
               <div ref={mapRef} className="w-full h-full rounded-b-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {!mapError && !isLoadingMap && !mapInstance && !apiKey && ( // Show only if API key is missing
         <Alert variant="destructive" className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Key Missing</AlertTitle>
            <AlertDescription>
              The Google Maps API key is not configured. Please add it to your environment variables to use this feature.
            </AlertDescription>
        </Alert>
      )}
       {apiKey && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Vet search and interactive map features are under development. Map powered by Google.
        </p>
      )}
    </>
  );
}

    