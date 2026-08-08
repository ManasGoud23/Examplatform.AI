import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase/config';

export async function createUserProfile(uid, userData = {}) {
  if (!uid) throw new Error("UID is required to create a user profile.");
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  const name = userData.name || userData.displayName || '';
  const email = userData.email || '';

  if (!userSnap.exists()) {
    const profilePayload = {
      name,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(userRef, profilePayload);
    return { ...profilePayload, uid };
  } else {
    const updates = {
      updatedAt: serverTimestamp()
    };
    if (name) updates.name = name;
    if (email) updates.email = email;

    await updateDoc(userRef, updates);
    return { ...userSnap.data(), ...updates, uid };
  }
}

export async function getUserProfile(uid) {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  return { ...userSnap.data(), uid };
}

export async function updateUserProfile(uid, data = {}) {
  if (!uid) throw new Error("UID is required to update a user profile.");
  const userRef = doc(db, 'users', uid);

  const payload = {
    ...data,
    updatedAt: serverTimestamp()
  };

  await updateDoc(userRef, payload);

  const updatedName = data.name || data.displayName;
  if (updatedName && auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { displayName: updatedName });
    } catch (e) {
      console.warn("Failed to update auth displayName:", e);
    }
  }

  const updatedSnap = await getDoc(userRef);
  return { ...updatedSnap.data(), uid };
}
