// lib/petitions/LocalStoragePetitionProvider.ts
import { VotingItem } from "@/app/types/voting";
import type { PetitionItem } from "@/app/types/parlimentPetitions";
import { getPetitionItem, getOpenPetitionsPage } from "./apiProvider";

const petitionItemToVotingItem = (petitionItem: PetitionItem) => ({
  id: petitionItem.id.toString(),
  title: petitionItem.attributes.action,
  description: petitionItem.attributes.background,
  imageUrl: "",
});

export async function getOpenPetitions(): Promise<VotingItem[]> {
  const openPetitionPage = await getOpenPetitionsPage(1);
  return openPetitionPage.data.map(petitionItemToVotingItem);
}

export async function getPetitionById(id: string): Promise<VotingItem> {
  const numberId = parseInt(id);
  if (Number.isNaN(numberId)) throw new Error(`Failed to parse id ${id}`);

  const petitionItem = await getPetitionItem(numberId);

  return petitionItemToVotingItem(petitionItem);
}
