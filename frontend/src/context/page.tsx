"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "@/services/page";

interface User {
  id: string;
  name: string;
  email: string;
  // Add more fields as per your backend response
}

interface ProfileContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      console.log('Profile fetched:', res);
      setUser(res?.user || null);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ user, loading, error, refetch: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
