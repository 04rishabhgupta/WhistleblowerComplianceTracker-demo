'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const { users, addUser } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Investigator' | 'SysAdmin'>('Investigator');
  const [department, setDepartment] = useState('');
  
  const handleAddUser = () => {
    if (!name.trim() || !email.trim() || !department.trim()) return;
    
    const avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    addUser({
      name,
      email,
      role,
      department,
      avatar
    });
    
    toast('User Created', {
      description: `${name} has been added as a ${role}.`,
    });
    
    setName('');
    setEmail('');
    setRole('Investigator');
    setDepartment('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">User Management</h1>
          <p className="text-muted-foreground">Manage platform access, roles, and staff accounts.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className={buttonVariants({ className: "gap-2" })}>
            <UserPlus className="h-4 w-4" />
            Add User
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new staff account. They will be able to log in with this persona.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane.doe@tari.co.in" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Platform Role</Label>
                <Select value={role} onValueChange={(val: any) => setRole(val)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Investigator">Investigator</SelectItem>
                    <SelectItem value="SysAdmin">SysAdmin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Legal & Compliance" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser} disabled={!name.trim() || !email.trim() || !department.trim()}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>All users with active access to the TARI Ethics platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                        {u.avatar}
                      </div>
                      {u.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === 'SysAdmin' ? 'default' : 'secondary'}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>{u.department || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
