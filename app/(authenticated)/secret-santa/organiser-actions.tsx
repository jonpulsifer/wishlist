'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { deleteExchange } from '@/app/_actions/secret-santa';
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
import { useAction } from '@/hooks/use-action';

/**
 * Deleting the Exchange you opened.
 *
 * The Organiser's, and nobody else's: organising one confers nothing over
 * another, so this is ownership of a row rather than a rank (ADR-0002).
 */
export function DeleteExchangeButton({
  exchangeId,
  name,
}: {
  exchangeId: string;
  name: string;
}) {
  const destroy = useAction(deleteExchange);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${name}`}
          disabled={destroy.isPending}
        >
          {destroy.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the exchange and its assignments. It cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => destroy.run(exchangeId)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
