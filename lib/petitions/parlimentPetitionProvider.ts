// lib/petitions/LocalStoragePetitionProvider.ts
import { VotingItem } from "@/types/voting";
import type { PetitionListResponse, PetitionItem } from "./types";

const BASE_URL = "https://petition.parliament.uk";

const petitionItemToVotingItem = (petitionItem: PetitionItem) => ({
  id: petitionItem.id.toString(),
  title: petitionItem.attributes.action,
  description: petitionItem.attributes.background,
  imageUrl: "",
});

export async function getOpenPetitions(page: number): Promise<VotingItem[]> {
  const res = await fetch(`${BASE_URL}/petitions.json?page=${page}&state=open`);
  if (!res.ok) throw new Error(`Failed to fetch petitions: ${res.status}`);

  const json = (await res.json()) as PetitionListResponse;

  return json.data.map(petitionItemToVotingItem);
}

export async function getPetitionById(id: string): Promise<VotingItem> {
  const numberId = parseInt(id);
  if (Number.isNaN(numberId)) throw new Error(`Failed to parse id ${id}`);

  const res = await fetch(`${BASE_URL}/petitions/${id}.json`);
  if (!res.ok) throw new Error(`Failed to fetch petition ${id}: ${res.status}`);

  const json = await res.json();
  const petition = json.data as PetitionItem;
  return petitionItemToVotingItem(petition);
}
