'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { drawExchange, openExchange } from '@/app/_actions/secret-santa';
import { AppHeader } from '@/components/app-header';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset } from '@/components/ui/sidebar';
import { useAction } from '@/hooks/use-action';
import {
  exchangeNameSchema,
  MINIMUM_PARTICIPANTS,
} from '@/lib/secret-santa/schema';

// The same schema the action validates against, rather than a second copy that
// only ever ran in the browser.
const formSchema = z.object({ name: exchangeNameSchema });

/** A Family the viewer belongs to, and the people in it. */
export type FamilyOption = {
  id: string;
  name: string;
  members: Array<{ id: string; name: string | null; email: string }>;
};

export function CreateEventWizard({ families }: { families: FamilyOption[] }) {
  const [step, setStep] = useState(1);
  const [familyId, setFamilyId] = useState(families[0]?.id ?? '');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const router = useRouter();

  // An Exchange is held by one Family, and only its members can be drawn — a
  // santa has to be able to see their recipient's Wishes.
  const users = families.find((f) => f.id === familyId)?.members ?? [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  // The event is announced by the draw that follows it, not on its own.
  const open = useAction(openExchange, { success: false });
  const assign = useAction(drawExchange, {
    // The event exists either way; only the draw failed, and the list is where
    // that is visible.
    onError: () => router.push('/secret-santa'),
    onSuccess: () => {
      router.push('/secret-santa');
      router.refresh();
    },
  });

  const isLoading = open.isPending || assign.isPending;

  // Step 1: name the event.
  const onSubmit = (_data: z.infer<typeof formSchema>) => {
    setStep(2);
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // Step 3: one commit — create the event with its participants, then draw.
  // The wizard is local state until here, so abandoning the flow cannot leave an
  // Event with no Participants behind it.
  const handleConfirmAssign = async () => {
    try {
      const created = await open.run({
        name: form.getValues('name'),
        familyId,
        participantIds: selectedUsers,
      });
      if (!created) return;

      await assign.run({ exchangeId: created.id });
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/secret-santa">Secret Santa</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-2 max-w-full overflow-hidden">
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
                  <div className="space-y-2">
                    <FormLabel htmlFor="familyId">Family</FormLabel>
                    <Select
                      value={familyId}
                      onValueChange={(id) => {
                        setFamilyId(id);
                        setSelectedUsers([]);
                      }}
                    >
                      <SelectTrigger id="familyId">
                        <SelectValue placeholder="Pick a family" />
                      </SelectTrigger>
                      <SelectContent>
                        {families.map((family) => (
                          <SelectItem key={family.id} value={family.id}>
                            {family.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Everyone drawn comes from this family, so each santa can
                      see what their person asked for.
                    </FormDescription>
                  </div>
                  <Button type="submit" disabled={!familyId}>
                    Continue to Participants
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
                    <span className="font-medium">People in this family</span>
                    <span className="text-sm text-muted-foreground">
                      {selectedUsers.length} selected
                    </span>
                  </div>
                  <div className="p-2 max-h-96 overflow-y-auto">
                    {users.length === 0 ? (
                      <div className="text-center p-4 text-muted-foreground">
                        Nobody else is in this family yet
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
                onClick={() => setStep(3)}
                disabled={selectedUsers.length < MINIMUM_PARTICIPANTS}
              >
                Continue to Review
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
