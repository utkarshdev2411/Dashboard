"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProfile } from "@/context/page";
import { use, useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const {user, loading} = useProfile();


  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background text-foreground px-6 py-10 md:py-20">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-16">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Dashboard Inc.</h1>
        {user ? (
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
            </Button>
        ) : (
            <div className="flex gap-4">
                <Button onClick={() => router.push("/auth/login")}>Login</Button>
                <Button onClick={() => router.push("/auth/signup")}>Sign Up</Button>
            </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl w-full gap-12">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Power Your Productivity <br /> with Modern Tools
          </h2>
          <p className="text-muted-foreground text-lg">
            Streamline your workflow, manage products, and analyze data all in one dashboard.
          </p>
          <div className="flex gap-4">
            <Button size="lg" onClick={() => router.push("/dashboard")}>{user?"Dashboard":"Get Started"}</Button>
            {user && <Button size="lg" variant="outline" onClick={() => router.push("/dashboard")}>View Demo</Button>}
          </div>
        </div>

        <div className="md:w-1/2 relative w-full h-[300px] md:h-[400px]">
          <Image
            src="https://res.cloudinary.com/dglwzejwk/image/upload/v1752408282/df2b373b-fc0b-4838-befb-5daa7a6ca4fd.png"
            alt="Dashboard preview"
            fill
            className="rounded-xl object-cover shadow-lg"
            priority
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Dashboard Inc. All rights reserved.
      </footer>
    </div>
  );
}
