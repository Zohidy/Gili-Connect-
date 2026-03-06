import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '../types';

interface UserCacheContextType {
  userCache: Record<string, User>;
  setUserCache: (userId: string, user: User) => void;
}

const UserCacheContext = createContext<UserCacheContextType | undefined>(undefined);

export const UserCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userCache, setUserCacheState] = useState<Record<string, User>>({});

  const setUserCache = useCallback((userId: string, user: User) => {
    setUserCacheState(prev => ({ ...prev, [userId]: user }));
  }, []);

  return (
    <UserCacheContext.Provider value={{ userCache, setUserCache }}>
      {children}
    </UserCacheContext.Provider>
  );
};

export const useUserCache = () => {
  const context = useContext(UserCacheContext);
  if (!context) {
    throw new Error('useUserCache must be used within a UserCacheProvider');
  }
  return context;
};
