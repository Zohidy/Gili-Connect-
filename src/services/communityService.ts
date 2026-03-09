import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const updateModerators = async (communityId: string, moderators: string[]) => {
  const communityRef = doc(db, 'communities', communityId);
  await updateDoc(communityRef, {
    moderators: moderators
  });
};
