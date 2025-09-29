import { Vote } from "@/app/types/voting";
import { openDB } from "./openDB";

export const VOTES_STORE_NAME = "votes";

export async function addVote(vote: Vote) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(VOTES_STORE_NAME, "readwrite");
    tx.objectStore(VOTES_STORE_NAME).put(vote, vote.itemId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllVotes(): Promise<Vote[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VOTES_STORE_NAME, "readonly");
    const req = tx.objectStore(VOTES_STORE_NAME).getAll();
    req.onsuccess = () => {
      // Convert stored strings back to Date
      const result = (req.result as any[]).map((v) => ({
        ...v,
        timestamp: new Date(v.timestamp),
      }));
      resolve(result);
    };
    req.onerror = () => reject(req.error);
  });
}
