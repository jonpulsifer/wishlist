'use client';

import { Loader2, Plus, Sparkles } from 'lucide-react';
import * as React from 'react';
import type { GiftFormData } from '@/app/_actions/gifts';
import { addGift } from '@/app/_actions/gifts';
import { getAIRecommendationsForUser } from '@/app/_actions/user';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAction } from '@/hooks/use-action';
import type { GiftRecommendation } from '@/lib/ai';
import { getInitials } from '@/lib/utils';
import type { User } from '@/prisma/generated/client';

type Props = {
  people: Pick<User, 'id' | 'name' | 'email'>[];
};

type Recommendation = GiftRecommendation & {
  isAdding?: boolean;
};

export function AIRecommendations({ people }: Props) {
  const [selectedPersonId, setSelectedPersonId] = React.useState<string>('');
  const [recommendations, setRecommendations] = React.useState<
    Recommendation[]
  >([]);
  const [targetUser, setTargetUser] = React.useState<{
    id: string;
    name: string | null;
    email: string;
  } | null>(null);

  const { run: fetchRecommendations, isPending: isLoading } = useAction(
    getAIRecommendationsForUser,
    {
      success: ({ recommendations, targetUser }) =>
        `Found ${recommendations.length} gift ideas for ${targetUser.name || targetUser.email}`,
      onSuccess: ({ recommendations, targetUser }) => {
        setRecommendations(recommendations);
        setTargetUser(targetUser);
      },
    },
  );

  const addingIndex = React.useRef<number | null>(null);
  const markAdding = (index: number, isAdding: boolean) =>
    setRecommendations((prev) =>
      prev.map((rec, i) => (i === index ? { ...rec, isAdding } : rec)),
    );

  const { run: submitGift } = useAction(addGift, {
    onSuccess: () => {
      const index = addingIndex.current;
      if (index !== null) {
        setRecommendations((prev) => prev.filter((_, i) => i !== index));
      }
    },
    onError: () => {
      if (addingIndex.current !== null) markAdding(addingIndex.current, false);
    },
  });

  const handleGetRecommendations = () => {
    if (!selectedPersonId) return;
    return fetchRecommendations(selectedPersonId);
  };

  const handleAddGift = (recommendation: Recommendation, index: number) => {
    if (!targetUser) return;

    addingIndex.current = index;
    markAdding(index, true);

    const formData: GiftFormData = {
      recipientId: targetUser.id,
      name: recommendation.name,
      description: recommendation.description || '',
      url: '',
    };
    return submitGift(formData);
  };

  return (
    <div className="space-y-6">
      {/* Selection Card */}
      <Card className="border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-950/30 dark:to-pink-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Get Gift Ideas
          </CardTitle>
          <CardDescription>
            Select someone to get AI-powered gift recommendations based on their
            complete wishlist history (including archived gifts)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={selectedPersonId}
              onValueChange={setSelectedPersonId}
            >
              <SelectTrigger className="w-full sm:flex-1">
                <SelectValue placeholder="Select a person..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>People</SelectLabel>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name || person.email}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGetRecommendations}
              disabled={!selectedPersonId || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && targetUser && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {getInitials(targetUser)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                Gift Ideas for {targetUser.name || targetUser.email}
              </h2>
              <p className="text-sm text-muted-foreground">
                {recommendations.length} AI-generated recommendations
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((recommendation, index) => (
              <Card
                key={index}
                className="relative overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full -translate-y-8 translate-x-8 opacity-10"></div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">
                    {recommendation.name}
                  </CardTitle>
                  {recommendation.estimatedPrice && (
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {recommendation.estimatedPrice}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {recommendation.description}
                  </p>
                  <Button
                    onClick={() => handleAddGift(recommendation, index)}
                    disabled={recommendation.isAdding}
                    className="w-full"
                    size="sm"
                  >
                    {recommendation.isAdding ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add to Wishlist
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recommendations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Select a person above and click "Get Recommendations" to see
              AI-powered gift suggestions based on their wishlist
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
