'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { useState } from 'react';
import { toast } from 'sonner';

export function TopBar() {
  const { activeUser, users, organizations, setActiveUser, addCase } = useAppStore();
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [targetOrgId, setTargetOrgId] = useState('');

  if (!activeUser) return null;

  const handleSimulateEmail = () => {
    if (!emailContent.trim() || !targetOrgId) return;

    addCase({
      organizationId: targetOrgId,
      status: 'New — Needs Triage',
      description: emailContent,
      source: 'Email',
      reporterEmail: 'anonymous_sender@protonmail.com',
      assigneeIds: [],
    });

    toast('New Case Created', {
      description: 'Incoming email was automatically converted to a case.',
    });

    setEmailContent('');
    setTargetOrgId('');
    setIsSimulateOpen(false);
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex flex-1 items-center gap-4">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-sidebar">
            <Sidebar className="w-full h-full border-none" />
          </SheetContent>
        </Sheet>
        <div className="w-full max-w-sm relative hidden sm:flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search cases, contacts..."
            className="w-full bg-background pl-9 md:w-[300px] lg:w-[400px]"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {activeUser.role === 'Investigator' && (
          <Dialog open={isSimulateOpen} onOpenChange={setIsSimulateOpen}>
            <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hidden md:flex bg-primary/5 text-primary hover:bg-primary/10 border-primary/20 h-9 px-3">
              Simulate Incoming Email
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Simulate Incoming Email</DialogTitle>
                <DialogDescription>
                  This demonstrates the automated intake flow. The content below will be instantly converted into a new case in the "Needs Triage" queue.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="targetOrg">To: (Simulates client-specific intake address)</Label>
                  <Select value={targetOrgId} onValueChange={(val) => setTargetOrgId(val || '')}>
                    <SelectTrigger id="targetOrg">
                      <SelectValue placeholder="Select target email..." />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.intakeEmail} ({org.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Type a mock whistleblower complaint here..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSimulateOpen(false)}>Cancel</Button>
                <Button onClick={handleSimulateEmail} disabled={!targetOrgId || !emailContent.trim()}>Simulate Intake</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]">
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex items-center gap-2 rounded-full border border-border px-2 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 hover:bg-accent hover:text-accent-foreground">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-[10px]">
              {activeUser.avatar}
            </div>
            <span className="hidden text-sm font-medium sm:block">{activeUser.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{activeUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{activeUser.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Persona (Demo)</DropdownMenuLabel>
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setActiveUser(user.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
