'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

import { Product } from "@/types/page"


interface TableComponentProps {
    productsList: Product[],
    setProductsList: React.Dispatch<React.SetStateAction<Product[]>>
}

const columnConfig = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'rating', label: 'Rating' },
]

export default function TableComponent({ productsList, setProductsList }: TableComponentProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [visibleColumns, setVisibleColumns] = useState<string[]>(columnConfig.map(c => c.key))

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
    )

    const handlePageChange = (dir: "prev" | "next" | "first" | "last") => {
        if (dir === "first") setPage(1)
        else if (dir === "last") setPage(totalPages)
        else if (dir === "prev" && page > 1) setPage(page - 1)
        else if (dir === "next" && page < totalPages) setPage(page + 1)
    }

    const handleSelectRow = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const toggleColumn = (key: string) => {
        setVisibleColumns(prev =>
            prev.includes(key) ? prev.filter(col => col !== key) : [...prev, key]
        )
    }

    const handleDeleteSelected = () => {
        const updated = products.filter(product => !selectedRows.includes(product.id))
        setProducts(updated)
        setSelectedRows([])
        setProductsList(updated) // ✅ Now it’s defined and passed up to parent
    }

    return (
        <div id="products" className="rounded-xl border bg-gradient-to-br from-background to-background/80 p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold">Products</h2>
                    <p className="text-muted-foreground text-sm">Manage your product inventory</p>
                </div>
                
                {/* Column Customization Dropdown + Delete Button */}
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-1">
                                <i className="fi fi-rr-settings-sliders text-sm"></i>
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {columnConfig.map(col => (
                                <DropdownMenuCheckboxItem
                                    key={col.key}
                                    checked={visibleColumns.includes(col.key)}
                                    onCheckedChange={() => toggleColumn(col.key)}
                                >
                                    {col.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-9 gap-1"
                        disabled={selectedRows.length === 0} 
                        onClick={handleDeleteSelected}
                    >
                        <i className="fi fi-rr-trash text-sm"></i>
                        {selectedRows.length > 0 ? `Delete (${selectedRows.length})` : "Delete"}
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox 
                                    disabled={products.length === 0}
                                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedRows(paginatedData.map(p => p.id));
                                        } else {
                                            setSelectedRows([]);
                                        }
                                    }}
                                />
                            </TableHead>
                            {columnConfig.map(col => (
                                visibleColumns.includes(col.key) && (
                                    <TableHead key={col.key} className="font-medium">
                                        {col.label}
                                    </TableHead>
                                )
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length + 1} className="text-center h-24 text-muted-foreground">
                                    No products found
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((product) => (
                                <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedRows.includes(product.id)}
                                            onCheckedChange={() => handleSelectRow(product.id)}
                                        />
                                    </TableCell>
                                    {visibleColumns.includes('id') && <TableCell className="font-mono text-xs text-muted-foreground">{product.id}</TableCell>}
                                    {visibleColumns.includes('title') && <TableCell className="font-medium">{product.title}</TableCell>}
                                    {visibleColumns.includes('brand') && <TableCell>{product.brand}</TableCell>}
                                    {visibleColumns.includes('category') && 
                                        <TableCell>
                                            <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                                {product.category}
                                            </span>
                                        </TableCell>
                                    }
                                    {visibleColumns.includes('price') && 
                                        <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                                    }
                                    {visibleColumns.includes('stock') && 
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                product.stock > 50 ? "bg-green-100 text-green-800" : 
                                                product.stock > 20 ? "bg-yellow-100 text-yellow-800" : 
                                                "bg-red-100 text-red-800"
                                            }`}>
                                                {product.stock}
                                            </span>
                                        </TableCell>
                                    }
                                    {visibleColumns.includes('rating') && 
                                        <TableCell>
                                            <div className="flex items-center">
                                                <span className="mr-2">{product.rating}</span>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i 
                                                            key={i} 
                                                            className={`fi fi-rr-star ${i < Math.floor(product.rating) ? "text-amber-400" : "text-muted"} text-xs`}
                                                        ></i>
                                                    ))}
                                                </div>
                                            </div>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Footer */}
            <div className="mt-6 flex items-center justify-between px-2 text-sm text-muted-foreground">
                <div className="bg-primary/5 px-3 py-1 rounded-full text-xs">
                    {selectedRows.length > 0 
                        ? `${selectedRows.length} of ${products.length} row(s) selected` 
                        : `${products.length} products total`
                    }
                </div>

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
                        <button 
                            onClick={() => handlePageChange("first")} 
                            className="p-1 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                            disabled={page === 1}
                        >
                            <i className="fi fi-rr-angle-double-left"></i>
                        </button>
                        <button 
                            onClick={() => handlePageChange("prev")} 
                            className="p-1 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                            disabled={page === 1}
                        >
                            <i className="fi fi-rr-angle-left"></i>
                        </button>
                        <button 
                            onClick={() => handlePageChange("next")} 
                            className="p-1 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                            disabled={page === totalPages}
                        >
                            <i className="fi fi-rr-angle-right"></i>
                        </button>
                        <button 
                            onClick={() => handlePageChange("last")} 
                            className="p-1 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                            disabled={page === totalPages}
                        >
                            <i className="fi fi-rr-angle-double-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
