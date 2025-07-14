"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TableComponent from "@/components/table.component";
import AnalyticsChart from "@/components/analytic.component";
import { Product } from "@/types/page";
import { motion } from "framer-motion";
import Sidebar from "@/components/sidebar.component";
import { useProfile } from "@/context/page";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useProfile();

  useEffect(() => {
    // Comment for authentication check
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      });
  }, []);

  const totalRevenue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const averageRating = (products.reduce((acc, p) => acc + p.rating, 0) / products.length || 0).toFixed(2);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalCategories = new Set(products.map((p) => p.category)).size;

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Card animation variants
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      },
    },
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background" style={{ "--sidebar-width": "clamp(240px, 24%, 320px)" } as React.CSSProperties}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          marginLeft: sidebarOpen ? 'var(--sidebar-width)' : '0',
          width: sidebarOpen ? 'calc(100% - var(--sidebar-width))' : '100%',
        } as React.CSSProperties}
        className="py-8 overflow-y-auto h-screen px-6 space-y-6 transition-all duration-300 ease-in-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4 pt-2">
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-all duration-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <i className={`fi fi-rr-angle-double-${sidebarOpen ? "left" : "right"} text-lg`}></i>
            </button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Badge>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground text-right">
                <div>Welcome back,</div>
                <div className="font-semibold text-foreground">{user.name || "User"}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="fi fi-rr-user text-primary"></i>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={cardVariants}>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-background">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                    <div className="text-3xl font-bold mt-1">${totalRevenue.toLocaleString()}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <i className="fi fi-rr-chart-line-up text-green-500"></i>
                  </div>
                </div>
                <div className="text-sm text-green-500 flex items-center">
                  <i className="fi fi-rr-arrow-trend-up mr-1"></i>
                  <span>Price × Stock</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Avg. Rating</div>
                    <div className="text-3xl font-bold mt-1">{averageRating}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <i className="fi fi-rr-star text-blue-500"></i>
                  </div>
                </div>
                <div className="text-sm text-blue-500 flex items-center">
                  <i className="fi fi-rr-users mr-1"></i>
                  <span>Customer Score</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-background">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Stock</div>
                    <div className="text-3xl font-bold mt-1">{totalStock.toLocaleString()}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <i className="fi fi-rr-box text-amber-500"></i>
                  </div>
                </div>
                <div className="text-sm text-amber-500 flex items-center">
                  <i className="fi fi-rr-boxes mr-1"></i>
                  <span>Inventory</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                    <div className="text-3xl font-bold mt-1">{totalCategories}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <i className="fi fi-rr-apps text-purple-500"></i>
                  </div>
                </div>
                <div className="text-sm text-purple-500 flex items-center">
                  <i className="fi fi-rr-grid mr-1"></i>
                  <span>Segmented</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Analytics Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          className="mt-8"
        >
          <AnalyticsChart productsList={products} />
        </motion.div>

        {/* Product Table */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <TableComponent productsList={products} setProductsList={setProducts} />
        </motion.div>
      </motion.div>
    </div>
  );
}
