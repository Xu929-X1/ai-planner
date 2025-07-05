'use client'
import { endpoints } from '@/app/api/route-helper'
import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

type UserType = {
  email: string,
  name?: string,
  id: number,
}

type UserContextType = {
  user: UserType | undefined,
  isLoading: boolean,
  getUserInfo: () => Promise<void>
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
  isLoading: false,
  getUserInfo: async () => { }
})


export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserType>();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getUser();
  }, [])
  async function getUser() {
    try {
      setIsLoading(true)
      const res = await axios.get<UserType>(endpoints.user.self.get, { withCredentials: true });
      setUserInfo(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setUserInfo(undefined);
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <UserContext.Provider value={{
      user: userInfo,
      isLoading: isLoading,
      getUserInfo: getUser
    }}>
      {
        children
      }
    </UserContext.Provider>
  )
}
