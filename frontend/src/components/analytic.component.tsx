'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

import { Product } from '@/types/page'

interface AnalyticsChartProps {
    productsList: Product[]
}

export default function AnalyticsChart({ productsList }: AnalyticsChartProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const totalPages = Math.ceil(products.length / rowsPerPage)

    useEffect(() => {
        // fetch("https://dummyjson.com/products?limit=100")
        //   .then((res) => res.json())
        //   .then((data) => setProducts(data.products))
        setProducts(productsList);
    }, [productsList])

    const paginatedData = products.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    ).map((product, index) => ({
        name: `P${(page - 1) * rowsPerPage + index + 1}`,
        price: product.price,
        rating: product.rating,
    }))

    const handlePageChange = (dir: "prev" | "next" | "first" | "last") => {
        if (dir === "first") setPage(1)
        else if (dir === "last") setPage(totalPages)
        else if (dir === "prev" && page > 1) setPage(page - 1)
        else if (dir === "next" && page < totalPages) setPage(page + 1)
    }

    return (
        <Card id='analytics' className="bg-gradient-to-br from-background to-background/80 border p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold">Analytics Overview</h2>
                    <p className="text-muted-foreground text-sm">Price and Rating Distribution</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        <span className="text-muted-foreground">Price</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm ml-4">
                        <div className="w-3 h-3 rounded-full bg-blue-400/80"></div>
                        <span className="text-muted-foreground">Rating</span>
                    </div>
                </div>
            </div>
            <CardContent className="h-[300px] p-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={paginatedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={12}
                            tick={{ fill: "#94a3b8" }}
                            axisLine={{ stroke: "#e2e8f0" }}
                            tickLine={{ stroke: "#e2e8f0" }}
                        />

                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tick={{ fill: "#94a3b8" }}
                            axisLine={{ stroke: "#e2e8f0" }}
                            tickLine={{ stroke: "#e2e8f0" }}
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#4ade80" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="rating" 
                            stroke="#22d3ee" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorRating)" 
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>

            {/* Pagination Footer */}
            <div className="mt-6 flex items-center justify-between px-2 text-sm text-muted-foreground">
                <div className="bg-primary/5 px-3 py-1 rounded-full text-xs">{`Showing ${paginatedData.length} of ${products.length} products`}</div>

                <div className="flex items-center space-x-4">
                    <span>Rows per page</span>
                    <Select value={rowsPerPage.toString()} onValueChange={(value) => {
                        setRowsPerPage(Number(value))
                        setPage(1)
                    }}>
                        <SelectTrigger className="w-[70px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30].map((val) => (
                                <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <span>{`Page ${page} of ${totalPages}`}</span>

                    <div className="flex items-center space-x-2">
                        <button onClick={() => handlePageChange("first")} className="p-1 rounded-full hover:bg-muted transition-colors">
                            <i className="fi fi-rr-angle-double-left"></i>
                        </button>
                        <button onClick={() => handlePageChange("prev")} className="p-1 rounded-full hover:bg-muted transition-colors">
                            <i className="fi fi-rr-angle-left"></i>
                        </button>
                        <button onClick={() => handlePageChange("next")} className="p-1 rounded-full hover:bg-muted transition-colors">
                            <i className="fi fi-rr-angle-right"></i>
                        </button>
                        <button onClick={() => handlePageChange("last")} className="p-1 rounded-full hover:bg-muted transition-colors">
                            <i className="fi fi-rr-angle-double-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
