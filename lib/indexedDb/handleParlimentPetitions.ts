import { PetitionListResponse } from "@/app/types/parlimentPetitions";
import { openDB } from "./openDB";

export const PETITIONS_STORE_NAME = "parliament_petitions";

export async function getFromDB(
  key: number
): Promise<PetitionListResponse | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PETITIONS_STORE_NAME, "readonly");
    const store = tx.objectStore(PETITIONS_STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function putToDB(
  key: number,
  value: PetitionListResponse
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PETITIONS_STORE_NAME, "readwrite");
    const store = tx.objectStore(PETITIONS_STORE_NAME);
    const request = store.put(value, key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
