'use client'
import { endpoints } from '@/app/api/route-helper'
import axios from 'axios'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type UserType = {
  email: string,
  name?: string,
  id: number,
}

type UserContextType = {
  user: UserType | undefined,
  isLoading: boolean,
  getUserInfo: () => Promise<void>,
  refreshUser: () => Promise<void>,
  clearUser: () => void
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
  isLoading: false,
  getUserInfo: async () => { },
  refreshUser: async () => { },
  clearUser: () => { }
})


export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserType>();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getUser();
  }, [])
  const getUser = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await axios.get<{ data: UserType }>(endpoints.user.self.get, { withCredentials: true });
      setUserInfo(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setUserInfo(undefined);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await getUser();
  }, [getUser]);

  const clearUser = useCallback(() => {
    setUserInfo(undefined);
  }, []);
  return (
    <UserContext.Provider value={{
      user: userInfo,
      isLoading: isLoading,
      getUserInfo: getUser,
      refreshUser,
      clearUser
    }}>
      {
        children
      }
    </UserContext.Provider>
  )
}