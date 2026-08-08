import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-8">
      <LoadingSpinner size="lg" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
