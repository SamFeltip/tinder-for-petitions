import { PetitionItem, PetitionListResponse } from "./types";

const BASE_URL = "https://petition.parliament.uk";

export async function getOpenPetitionsPage(page: number) {
  const res = await fetch(`${BASE_URL}/petitions.json?page=${page}&state=open`);
  if (!res.ok) throw new Error(`Failed to fetch petitions: ${res.status}`);

  const json = (await res.json()) as PetitionListResponse;
  return json;
}

export async function getPetitionItem(id: number) {
  const res = await fetch(`${BASE_URL}/petitions/${id.toString()}.json`);
  if (!res.ok) throw new Error(`Failed to fetch petition ${id}: ${res.status}`);

  const json = await res.json();
  const petition = json.data as PetitionItem;

  return petition;
}
