'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  addParticipantsToSecretSantaEvent,
  assignSecretSantaParticipants,
  createSecretSantaEvent,
} from '@/app/actions';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  _count: {
    gifts: number;
  };
}

export default function CreateSecretSantaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [eventId, setEventId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  // Step 1: Create the event
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await createSecretSantaEvent(data.name);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      if (result.id) {
        setEventId(result.id);
        await loadPeople();
        setStep(2);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load people from wishlists
  const loadPeople = async () => {
    try {
      // Use fetch instead of direct module import to avoid Node.js issues
      const response = await fetch('/api/people');
      if (!response.ok) {
        throw new Error('Failed to fetch people');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading people:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load people',
      });
    }
  };

  // Toggle user selection
  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // Step 2: Add participants
  const handleAddParticipants = async () => {
    if (!eventId) return;

    setIsLoading(true);
    try {
      const result = await addParticipantsToSecretSantaEvent(
        eventId,
        selectedUsers,
      );

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      setStep(3);
    } catch (error) {
      console.error('Error adding participants:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add participants',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Confirm and assign
  const handleConfirmAssign = async () => {
    if (!eventId) return;

    setIsLoading(true);
    try {
      const result = await assignSecretSantaParticipants(eventId);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      toast({
        title: 'Success!',
        description: 'Secret Santa has been set up successfully',
      });

      router.push('/secret-santa');
      router.refresh();
    } catch (error) {
      console.error('Error assigning participants:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to assign participants',
      });
    } finally {
      setIsLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/secret-santa">
                  Secret Santa
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Create Secret Santa
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Set up a new Secret Santa event for your friends and family.
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'border bg-background'}`}
            >
              {step > 1 ? <Check className="h-4 w-4" /> : 1}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Create Event</span>
              <span className="text-xs text-muted-foreground">
                Name your Secret Santa
              </span>
            </div>
          </div>
          <Separator className="flex-1 mx-4" />
          <div className="flex gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'border bg-background'}`}
            >
              {step > 2 ? <Check className="h-4 w-4" /> : 2}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Add Participants</span>
              <span className="text-xs text-muted-foreground">
                Select who's joining
              </span>
            </div>
          </div>
          <Separator className="flex-1 mx-4" />
          <div className="flex gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'border bg-background'}`}
            >
              {step > 3 ? <Check className="h-4 w-4" /> : 3}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Confirm</span>
              <span className="text-xs text-muted-foreground">
                Review and assign
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Create Event */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Give your Secret Santa event a name
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Christmas 2023" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will help you identify this Secret Santa event.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Continue to Participants'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Add Participants */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Participants</CardTitle>
              <CardDescription>
                Choose who will participate in this Secret Santa event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md">
                  <div className="p-4 flex justify-between items-center border-b">
                    <span className="font-medium">
                      People in your Wishlists
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedUsers.length} selected
                    </span>
                  </div>
                  <div className="p-2 max-h-96 overflow-y-auto">
                    {users.length === 0 ? (
                      <div className="text-center p-4 text-muted-foreground">
                        No people found in your wishlists
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 cursor-pointer ${
                              selectedUsers.includes(user.id) ? 'bg-accent' : ''
                            }`}
                            onClick={() => toggleUser(user.id)}
                          >
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => toggleUser(user.id)}
                              id={`user-${user.id}`}
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="flex items-center flex-1 cursor-pointer"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {user.name || user.email}
                                </p>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                onClick={handleAddParticipants}
                disabled={selectedUsers.length < 3 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Continue to Review'
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm and Assign</CardTitle>
              <CardDescription>
                Review your Secret Santa event before finalizing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">
                    Selected Participants ({selectedUsers.length})
                  </h3>
                  <div className="grid gap-2">
                    {users
                      .filter((user) => selectedUsers.includes(user.id))
                      .map((user) => (
                        <div key={user.id} className="flex items-center gap-2">
                          <span className="text-sm">
                            {user.name || user.email}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
                  <p className="text-sm">
                    <strong>Important:</strong> Once you confirm and assign
                    Secret Santas, the assignments cannot be changed. Make sure
                    all participants are correct before proceeding.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                variant="default"
                onClick={() => setConfirmDialogOpen(true)}
                disabled={isLoading}
              >
                Confirm & Assign Secret Santas
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Secret Santa Assignments</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed? Once assignments are made, they
              cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmAssign} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm & Assign'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
}
