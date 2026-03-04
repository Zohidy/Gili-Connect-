export type IslandRole = 'Tourist' | 'Local' | 'Business' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: IslandRole;
  avatar: string;
  badges: string[];
  bio?: string;
  location?: string;
  coverImage?: string;
  joinedAt?: string;
}

export type PostCategory = 'Party' | 'Fastboat' | 'Safety' | 'Food' | 'News' | 'Marketplace';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  category: PostCategory;
  content: string;
  image?: string;
  likes: number;
  likedBy?: string[];
  parentId?: string;
  replyCount: number;
}

export interface IslandSpot {
  id: string;
  name: string;
  category: string;
  status: 'Open' | 'Closed';
  location: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  type: 'Selling' | 'Lost' | 'Found';
  image: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}
