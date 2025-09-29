import { getFromDB, putToDB } from "@/lib/indexedDb/handleParlimentPetitions";
import {
  PetitionItem,
  PetitionListResponse,
} from "@/app/types/parlimentPetitions";

const BASE_URL = "https://petition.parliament.uk";
const PAGE_SIZE = 50;

export async function getOpenPetitionsPage(
  page: number
): Promise<PetitionListResponse> {
  const cached = await getFromDB(page);
  if (cached) {
    console.log(`Loaded petitions page ${page} from IndexedDB`);
    return cached;
  }

  const res = await fetch(`${BASE_URL}/petitions.json?page=${page}&state=open`);
  if (!res.ok) throw new Error(`Failed to fetch petitions: ${res.status}`);

  const json = (await res.json()) as PetitionListResponse;

  // 3. Save to IndexedDB
  await putToDB(page, json);
  console.log(`Stored petitions page ${page} in IndexedDB`);

  return json;
}

export async function getPetitionItem(id: number) {
  const res = await fetch(`${BASE_URL}/petitions/${id.toString()}.json`);
  if (!res.ok) throw new Error(`Failed to fetch petition ${id}: ${res.status}`);

  const json = await res.json();
  const petition = json.data as PetitionItem;

  return petition;
}
