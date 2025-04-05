
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
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, X, ChevronDown, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataFilter, FilterCondition } from "./data-filter";

interface DataTableColumn {
  key: string;
  header: string;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
  filterOptions?: string[]; // For dropdown filter options
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn[];
  filterableColumns?: string[];
  className?: string;
  expandableContent?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  expandedRowId?: string | null;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  filterableColumns = [],
  className,
  expandableContent,
  onRowClick,
  expandedRowId,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      // Apply quick filters
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        
        const cellValue = String(row[key] || '').toLowerCase();
        if (!cellValue.includes(value.toLowerCase())) {
          return false;
        }
      }
      
      // Apply advanced filter conditions
      for (const condition of filterConditions) {
        const cellValue = String(row[condition.field] || '');
        const filterValue = condition.value;
        
        switch (condition.operator) {
          case "contains":
            if (!cellValue.toLowerCase().includes(filterValue.toLowerCase())) return false;
            break;
          case "equals":
            if (cellValue.toLowerCase() !== filterValue.toLowerCase()) return false;
            break;
          case "startsWith":
            if (!cellValue.toLowerCase().startsWith(filterValue.toLowerCase())) return false;
            break;
          case "endsWith":
            if (!cellValue.toLowerCase().endsWith(filterValue.toLowerCase())) return false;
            break;
          case "greaterThan":
            if (isNaN(Number(cellValue)) || isNaN(Number(filterValue))) {
              if (cellValue.localeCompare(filterValue) <= 0) return false;
            } else {
              if (Number(cellValue) <= Number(filterValue)) return false;
            }
            break;
          case "lessThan":
            if (isNaN(Number(cellValue)) || isNaN(Number(filterValue))) {
              if (cellValue.localeCompare(filterValue) >= 0) return false;
            } else {
              if (Number(cellValue) >= Number(filterValue)) return false;
            }
            break;
        }
      }
      
      // Apply global search
      if (searchQuery) {
        const searchFields = columns.filter(col => col.filterable || filterableColumns.includes(col.key)).map(col => col.key);
        return searchFields.some(field => 
          String(row[field] || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return true;
    });
  }, [data, filters, filterConditions, searchQuery, columns, filterableColumns]);

  const handleQuickFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFilterConditionsChange = (newConditions: FilterCondition[]) => {
    setFilterConditions(newConditions);
  };

  const clearQuickFilter = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setFilterConditions([]);
    setSearchQuery("");
  };

  const availableFilterColumns = columns.filter(col => 
    filterableColumns.includes(col.key) || col.filterable
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm toàn cục..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      
      <DataFilter 
        columns={availableFilterColumns}
        onFilterChange={handleFilterConditionsChange}
        activeFilters={filterConditions}
      />
      
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            const column = columns.find(col => col.key === key);
            return (
              <div key={key} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                <span className="text-sm font-medium">{column?.header || key}:</span>
                <Input
                  value={value}
                  onChange={(e) => handleQuickFilterChange(key, e.target.value)}
                  className="h-6 rounded-sm border-none bg-transparent p-0 text-sm focus-visible:outline-none focus-visible:ring-0 w-24"
                  placeholder="Tìm kiếm..."
                />
                <button 
                  onClick={() => clearQuickFilter(key)}
                  className="rounded-full hover:bg-background/90 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-md border">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={column.width ? `w-[${column.width}]` : ''}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {(column.filterable || filterableColumns.includes(column.key)) && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Filter className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-3">
                          <div className="space-y-2">
                            <h4 className="font-medium">Lọc {column.header}</h4>
                            <Input
                              placeholder="Nhập giá trị..."
                              className="w-full"
                              value={filters[column.key] || ''}
                              onChange={(e) => handleQuickFilterChange(column.key, e.target.value)}
                            />
                            <div className="flex justify-between">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => clearQuickFilter(column.key)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <React.Fragment key={idx}>
                  <TableRow 
                    onClick={() => onRowClick && onRowClick(row)}
                    className={onRowClick ? "cursor-pointer" : ""}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render 
                          ? column.render(row[column.key], row)
                          : row[column.key]
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandableContent && expandedRowId === row.id && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0 border-t-0">
                        <div className="px-4 py-2 bg-muted/20">
                          {expandableContent(row)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {Object.keys(filters).length > 0 || filterConditions.length > 0 || searchQuery
                    ? "Không tìm thấy kết quả phù hợp với điều kiện lọc" 
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
