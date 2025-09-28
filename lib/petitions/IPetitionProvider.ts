// lib/petitions/IPetitionProvider.ts
import { VotingItem } from "@/types/voting.js";
import type { PetitionListResponse, PetitionItem } from "./types.js";

export interface IVotingItemProvider {
  getOpenPetitions(page: number): Promise<VotingItem[]>;
  getPetitionById(id: string): Promise<VotingItem>;
}
