// lib/petitions/LocalStoragePetitionProvider.ts
import { VotingItem } from "@/types/voting";
import type { IVotingItemProvider } from "./IPetitionProvider";
import type { PetitionListResponse, PetitionItem } from "./types";

const BASE_URL = "https://petition.parliament.uk";
const LIST_KEY_PREFIX = "petitions:list:";
const ITEM_KEY_PREFIX = "petitions:item:";

export class ParliamentPetitionProvider implements IVotingItemProvider {
  petitionItemToVotingItem = (petitionItem: PetitionItem) => ({
    id: petitionItem.id.toString(),
    title: petitionItem.attributes.action,
    description: petitionItem.attributes.background,
    imageUrl: "",
  });

  async getOpenPetitions(page: number): Promise<VotingItem[]> {
    const cached = this.getCachedPetitionList(page);
    if (cached) return cached.data.map(this.petitionItemToVotingItem);

    const res = await fetch(
      `${BASE_URL}/petitions.json?page=${page}&state=open`
    );
    if (!res.ok) throw new Error(`Failed to fetch petitions: ${res.status}`);

    const json = (await res.json()) as PetitionListResponse;
    this.cachePetitionList(json);

    return json.data.map(this.petitionItemToVotingItem);
  }

  async getPetitionById(id: string): Promise<VotingItem> {
    const numberId = parseInt(id);
    if (Number.isNaN(numberId)) throw new Error(`Failed to parse id ${id}`);

    const cached = this.getCachedPetition(numberId);
    if (cached) return this.petitionItemToVotingItem(cached);

    const res = await fetch(`${BASE_URL}/petitions/${id}.json`);
    if (!res.ok)
      throw new Error(`Failed to fetch petition ${id}: ${res.status}`);

    const json = await res.json();
    const petition = json.data as PetitionItem;
    this.cachePetition(petition);
    return this.petitionItemToVotingItem(petition);
  }

  cachePetition(item: PetitionItem): void {
    try {
      localStorage.setItem(
        `${ITEM_KEY_PREFIX}${item.id}`,
        JSON.stringify(item)
      );
    } catch (e) {
      console.warn("Failed to cache petition", e);
    }
  }

  getCachedPetition(id: number): PetitionItem | null {
    const raw = localStorage.getItem(`${ITEM_KEY_PREFIX}${id}`);
    return raw ? (JSON.parse(raw) as PetitionItem) : null;
  }

  cachePetitionList(response: PetitionListResponse): void {
    try {
      const page = new URL(response.links.self).searchParams.get("page") ?? "1";
      localStorage.setItem(
        `${LIST_KEY_PREFIX}${page}`,
        JSON.stringify(response)
      );
      response.data.forEach((p) => this.cachePetition(p)); // also store items individually
    } catch (e) {
      console.warn("Failed to cache petition list", e);
    }
  }

  getCachedPetitionList(page: number): PetitionListResponse | null {
    const raw = localStorage.getItem(`${LIST_KEY_PREFIX}${page}`);
    return raw ? (JSON.parse(raw) as PetitionListResponse) : null;
  }
}
