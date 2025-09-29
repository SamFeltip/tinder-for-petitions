import { PETITIONS_STORE_NAME } from "./handleParlimentPetitions";
import { VOTES_STORE_NAME } from "./handleVotes";

export const DB_NAME = "petitionsDB";
export const DB_VERSION = 2;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PETITIONS_STORE_NAME)) {
        db.createObjectStore(PETITIONS_STORE_NAME);
      }

      if (!db.objectStoreNames.contains(VOTES_STORE_NAME)) {
        db.createObjectStore(VOTES_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
