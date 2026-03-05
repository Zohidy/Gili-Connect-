import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Report } from '../types';

export const reportPost = async (postId: string, reporterId: string, reason: string) => {
  const reportsCollection = collection(db, 'reports');
  await addDoc(reportsCollection, {
    postId,
    reporterId,
    reason,
    timestamp: serverTimestamp(),
    status: 'pending',
  });
};
