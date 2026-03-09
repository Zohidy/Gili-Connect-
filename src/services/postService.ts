import { doc, updateDoc, arrayUnion, arrayRemove, increment, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from '../types';

export const likePost = async (postId: string, userId: string, isLiked: boolean) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likes: increment(isLiked ? -1 : 1),
    likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
  });
};

export const createPost = async (post: Omit<Post, 'id' | 'createdAt'>) => {
  const postRef = collection(db, 'posts');
  await addDoc(postRef, {
    ...post,
    createdAt: Timestamp.now(),
    likes: 0,
    likedBy: [],
    replyCount: 0
  });
};
