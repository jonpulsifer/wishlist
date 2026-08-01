'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { updateUser } from '@/app/_actions/user';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useAction } from '@/hooks/use-action';
import type { Profile } from '@/lib/db/projections';

const formSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  sizes: z.object({
    pants: z.string().optional(),
    shirt: z.string().optional(),
    shoes: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function UserDetailsForm({ user }: { user: Profile }) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      address: user?.address || '',
      sizes: {
        pants: user?.pant_size || '',
        shirt: user?.shirt_size || '',
        shoes: user?.shoe_size || '',
      },
    },
  });

  const { run: onSubmit, isPending } = useAction(updateUser, {
    onSuccess: () => {
      router.push(`/people/${user.id}`);
      router.refresh();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <Input disabled value={user.email} />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Christmas Lane" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where should your gifts be delivered?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-4">Sizes</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="sizes.pants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pants Size</FormLabel>
                      <FormControl>
                        <Input placeholder="6" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sizes.shirt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shirt Size</FormLabel>
                      <FormControl>
                        <Input placeholder="M" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sizes.shoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shoe Size</FormLabel>
                      <FormControl>
                        <Input placeholder="8" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
