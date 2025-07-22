// memory.js
import { db } from './firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Save memory (key-value pair)
export async function saveMemory(key, value) {
  const ref = doc(db, "joey_memory", key);
  await setDoc(ref, { value });
}

// Load memory
export async function loadMemory(key) {
  const ref = doc(db, "joey_memory", key);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().value : null;
}