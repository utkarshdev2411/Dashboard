"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/context/page";
import LandingPage from "@/components/landing.page";
export default function Home() {
  const { user, loading, error } = useProfile();
  const router = useRouter();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user) {
      console.log('Loading:', loading, 'User:', user);
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
     <LandingPage/>
    </main>
  );
}
