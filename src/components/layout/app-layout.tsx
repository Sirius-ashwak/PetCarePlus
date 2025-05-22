
"use client";
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, PawPrint, Stethoscope, ListChecks, Bone, LogOut, UserCircle, Sparkles, ScanSearch, BellRing, Mic, AlertTriangle as EmergencyIcon } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context'; 
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 
import { ThemeToggleButton } from '../theme-toggle-button'; // Import ThemeToggleButton

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/pets', label: 'My Pets', icon: PawPrint },
  { href: '/reminders', label: 'Reminders', icon: BellRing },
  { href: '/emergency', label: 'Emergency', icon: EmergencyIcon },
  { href: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
  { href: '/allergies', label: 'Allergies & Diet', icon: ListChecks },
  { 
    label: 'AI Tools',
    isGroup: true,
    items: [
      { href: '/tools/pet-name-generator', label: 'Name Generator', icon: Sparkles },
      { href: '/tools/breed-identifier', label: 'Breed Identifier', icon: ScanSearch },
      { href: '/tools/voice-assistant', label: 'Voice Assistant', icon: Mic },
    ]
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth(); 
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };
  
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : <UserCircle size={20}/>;

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 flex flex-col items-start">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors">
            <Bone className="h-7 w-7 text-sidebar-primary" /> PetCare+
          </Link>
          {user && (
             <div className="mt-4 flex items-center gap-2 p-2 rounded-md bg-sidebar-accent w-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs">
                  <p className="font-medium text-sidebar-foreground">{user.name || user.email}</p>
                  <p className="text-sidebar-foreground/70">{user.name ? user.email : "User"}</p>
                </div>
            </div>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item, index) => (
              item.isGroup ? (
                <React.Fragment key={`group-${index}`}>
                  {item.items && item.items.length > 0 && (
                     <div className="px-2 pt-2 pb-1">
                       <span className="text-xs font-semibold text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">{item.label}</span>
                     </div>
                  )}
                  {item.items?.map(subItem => (
                    <SidebarMenuItem key={subItem.href}>
                      <Link href={subItem.href} legacyBehavior passHref>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === subItem.href || pathname.startsWith(subItem.href + '/')}
                          tooltip={subItem.label}
                        >
                          <a>
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </React.Fragment>
              ) : (
                 <SidebarMenuItem key={item.href}>
                  <Link href={item.href!} legacyBehavior passHref>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href! + '/'))}
                      tooltip={item.label}
                    >
                      <a>
                        {item.icon && <item.icon />}
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
           <SidebarMenu>
             <SidebarMenuItem>
                <ThemeToggleButton />
             </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
           <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
              <Bone className="h-6 w-6 text-primary" /> PetCare+
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
