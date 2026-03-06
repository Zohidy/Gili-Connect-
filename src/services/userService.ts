import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types';

export const getUserById = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data() as User;
  }
  return null;
};
