import { Timestamp } from 'firebase/firestore';

export type IslandRole = 'Tourist' | 'Local' | 'Business' | 'Admin' | 'Moderator' | 'Supporter';
export type PostCategory = 'Party' | 'Fastboat' | 'Safety' | 'Food' | 'News' | 'Marketplace' | 'Gili Vibes';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Timestamp;
  displayName?: string;
  bio?: string;
  profilePictureUrl?: string;
  role?: IslandRole;
  name?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  giliConnection?: string;
  interests?: string[];
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: Timestamp | string;
  timestamp?: string;
  mediaUrl?: string;
  mediaType?: string;
  category?: PostCategory;
  userAvatar?: string;
  userName?: string;
  userRole?: IslandRole;
  location?: string;
  likes?: number;
  likedBy?: string[];
  replyCount?: number;
  parentId?: string;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: Timestamp;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  text: string;
  createdAt: Timestamp;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Timestamp;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: Timestamp;
}

export interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'reply' | 'follow';
  senderId: string;
  senderName: string;
  postId?: string;
  timestamp: string;
  read: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  imageUrl?: string;
  organizerId: string;
}

export interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  status: 'going' | 'interested';
}
