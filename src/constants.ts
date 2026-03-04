import { Post, IslandSpot, MarketplaceItem } from './types';

export const INITIAL_SPOTS: IslandSpot[] = [
  { id: '1', name: 'Gili T Medical', category: 'Medical', status: 'Open', location: 'Near Central Pier' },
  { id: '2', name: 'Bank Mandiri ATM', category: 'Finance', status: 'Open', location: 'Main Street' },
  { id: '3', name: 'Police Station', category: 'Safety', status: 'Open', location: 'Harbor Area' },
  { id: '4', name: 'Fastboat Harbor', category: 'Transport', status: 'Open', location: 'East Coast' },
];

export const INITIAL_MARKET: MarketplaceItem[] = [
  { id: '1', title: 'Surfboard 7ft', price: 'IDR 2.5M', type: 'Selling', image: 'https://picsum.photos/seed/surf/400/300' },
  { id: '2', title: 'Lost iPhone 14', price: 'Reward', type: 'Lost', image: 'https://picsum.photos/seed/phone/400/300' },
  { id: '3', title: 'Found Sunglasses', price: 'Free', type: 'Found', image: 'https://picsum.photos/seed/glass/400/300' },
];

export const MOCK_POSTS: Post[] = [];
export const ISLAND_SPOTS: IslandSpot[] = [];
export const MARKET_ITEMS: MarketplaceItem[] = [];
