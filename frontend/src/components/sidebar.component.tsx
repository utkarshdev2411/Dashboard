"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/page";
import { useRouter } from "next/navigation"; // ✅ Correct for app router
import Link from "next/link";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> // ⬅️ Add this prop to control sidebar state
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const { user, refetch } = useProfile(); // ⬅ include refetch if you want to refresh user state
    const router = useRouter();

    // This ensures the setSidebarOpen is "used" to satisfy TypeScript
    // while we control sidebar exclusively from the dashboard
    const unusedConditional = false;
    if (unusedConditional) setSidebarOpen(prev => prev);

    const handleLogout = () => {
        localStorage.removeItem("token");     // 🔐 Remove token
        refetch();                            // 🔄 Reset user context (optional)
        router.push("/auth/login");           // 🔁 Redirect to login
    };

    return (
        <motion.aside
            initial={{ x: -300, width: 0, opacity: 0 }}
            animate={{ 
                x: 0,
                width: sidebarOpen ? 'var(--sidebar-width)' : '0',
                opacity: sidebarOpen ? 1 : 0,
            }}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                width: { duration: 0.3 },
                opacity: { duration: 0.3 }
            }}
            className={cn(
                "bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 text-zinc-900 dark:text-slate-100 py-6 shadow-lg z-30 fixed top-0 left-0 h-screen flex flex-col overflow-hidden"
            )}
        >
            <div className="flex w-full items-center px-6 mb-8">
                <Link href={'/'} className="text-2xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <i className="fi fi-rr-dashboard text-primary"></i>
                    </div>
                    <span className="text-foreground">Dash<span className="text-primary">Board</span></span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-10 text-sm">
                <div className="space-y-2">
                    <p className="uppercase text-muted-foreground text-xs font-semibold ml-2 mb-3">Dashboard</p>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary/10 text-primary">
                        <i className="fi fi-rr-apps-add text-base"></i>
                        Overview
                    </a>
                    <a href="#analytics" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted/80 text-foreground transition-colors duration-200">
                        <i className="fi fi-rr-chart-line-up text-base"></i>
                        Analytics
                    </a>
                    <a href="#products" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted/80 text-foreground transition-colors duration-200">
                        <i className="fi fi-rr-box text-base"></i>
                        Products
                    </a>
                </div>

                <div className="space-y-2">
                    <p className="uppercase text-muted-foreground text-xs font-semibold ml-2 mb-3">Account</p>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted/80 text-foreground transition-colors duration-200">
                        <i className="fi fi-rr-user text-base"></i>
                        Profile
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted/80 text-foreground transition-colors duration-200">
                        <i className="fi fi-rr-settings text-base"></i>
                        Settings
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left gap-3 px-4 py-2.5 rounded-lg hover:bg-red-100/80 text-red-500 transition-colors duration-200"
                    >
                        <i className="fi fi-rr-sign-out-alt text-base"></i>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Profile section at bottom */}
            <div className="mt-auto border-t border-muted mx-4 pt-4 pb-2">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <i className="fi fi-rr-user text-primary"></i>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-foreground">{user?.name || "John Doe"}</div>
                        <div className="text-xs text-muted-foreground">{user?.email || "john@example.com"}</div>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
