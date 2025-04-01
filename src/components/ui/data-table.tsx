
import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface DataTableColumn {
  key: string;
  header: string;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn[];
  filterableColumns?: string[];
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  filterableColumns = [],
  className,
}: DataTableProps<T>) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        
        const cellValue = String(row[key] || '').toLowerCase();
        if (!cellValue.includes(value.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [data, filters]);

  const availableFilterColumns = columns.filter(col => 
    filterableColumns.includes(col.key) || col.filterable
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilter = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const addFilter = (columnKey: string) => {
    setActiveFilterColumn(null);
    if (!filters[columnKey]) {
      setFilters(prev => ({
        ...prev,
        [columnKey]: ''
      }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {Object.keys(filters).length > 0 ? (
              <span>Đang lọc {filteredData.length} / {data.length} kết quả</span>
            ) : (
              <span>Hiển thị {data.length} kết quả</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={activeFilterColumn || ""}
              onValueChange={(value) => value ? addFilter(value) : null}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Thêm bộ lọc..." />
              </SelectTrigger>
              <SelectContent>
                {availableFilterColumns.map((column) => (
                  <SelectItem 
                    key={column.key} 
                    value={column.key}
                    disabled={Boolean(filters[column.key])}
                  >
                    {column.header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {Object.keys(filters).length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Xóa tất cả
              </button>
            )}
          </div>
        </div>
        
        {/* Active filters */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              const column = columns.find(col => col.key === key);
              return (
                <div key={key} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                  <span className="text-sm font-medium">{column?.header || key}:</span>
                  <Input
                    value={value}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="h-6 rounded-sm border-none bg-transparent p-0 text-sm focus-visible:outline-none focus-visible:ring-0 w-24"
                    placeholder="Tìm kiếm..."
                  />
                  <button 
                    onClick={() => clearFilter(key)}
                    className="rounded-full hover:bg-background/90 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={column.width ? `w-[${column.width}]` : ''}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {Object.keys(filters).length > 0 
                    ? "Không tìm thấy kết quả phù hợp với bộ lọc" 
                    : "Không có dữ liệu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                Hiển thị {filteredData.length} / {data.length} kết quả
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
