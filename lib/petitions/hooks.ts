// lib/petitions/hooks.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ParliamentPetitionProvider } from "./LocalStoragePetitionProvider";
import type { PetitionListResponse, PetitionItem } from "./types.ts";
import { VotingItem } from "@/types/voting";

const provider = new ParliamentPetitionProvider();

export function useOpenPetitions(page: number) {
  // const queryClient = useQueryClient();

  return useQuery<VotingItem[]>({
    queryKey: ["petitions", "open", page],
    queryFn: () => provider.getOpenPetitions(page),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function usePetition(id: string) {
  return useQuery<VotingItem>({
    queryKey: ["petition", id],
    queryFn: () => provider.getPetitionById(id),
    staleTime: 1000 * 60,
  });
}
