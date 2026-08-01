'use client';

import { Plus, Shield, Trash2, Users } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  assignRoleToUser,
  createRole,
  deleteRole,
  removeRoleFromUser,
} from '@/app/_actions/roles';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface User {
  id: string;
  name: string | null;
  email: string;
  roles: Array<{
    role: {
      id: string;
      name: string;
    };
  }>;
}

interface Role {
  id: string;
  name: string;
  users: Array<{
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
}

interface RoleManagerProps {
  roles: Role[];
  users: User[];
}

export function RoleManager({ roles, users }: RoleManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error('Role name is required');
      return;
    }

    startTransition(async () => {
      const result = await createRole(newRoleName.trim());
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Role created successfully');
        setNewRoleName('');
        setIsCreateDialogOpen(false);
      }
    });
  };

  const handleAssignRole = () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Please select both user and role');
      return;
    }

    startTransition(async () => {
      const result = await assignRoleToUser({
        userId: selectedUser,
        roleId: selectedRole,
      });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Role assigned successfully');
        setSelectedUser('');
        setSelectedRole('');
        setIsAssignDialogOpen(false);
      }
    });
  };

  const handleRemoveRole = (userId: string, roleId: string) => {
    startTransition(async () => {
      const result = await removeRoleFromUser({ userId, roleId });
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Role removed successfully');
      }
    });
  };

  const handleDeleteRole = (roleId: string) => {
    startTransition(async () => {
      const result = await deleteRole(roleId);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Role deleted successfully');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Create a new role that can be assigned to users.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g., Moderator, Editor"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateRole} disabled={isPending}>
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Role to User</DialogTitle>
              <DialogDescription>
                Assign a role to a user to grant them specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user">User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignRole} disabled={isPending}>
                Assign Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {role.name}
              </CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the "{role.name}" role?
                      This will remove it from all users and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteRole(role.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                {role.users.length} user{role.users.length !== 1 ? 's' : ''}{' '}
                assigned
              </CardDescription>
              <div className="space-y-2">
                {role.users.map((userRole) => (
                  <div
                    key={userRole.user.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {userRole.user.name || userRole.user.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveRole(userRole.user.id, role.id)
                      }
                      disabled={isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {role.users.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No users assigned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {roles.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No roles created</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first role to start managing user permissions.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
