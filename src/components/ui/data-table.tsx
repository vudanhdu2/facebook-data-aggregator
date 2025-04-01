
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

interface DataTableColumn {
  key: string;
  header: string;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
  filterOptions?: string[]; // For dropdown filter options
}

interface FilterCondition {
  column: string;
  value: string;
  operator: "contains" | "equals" | "startsWith" | "endsWith" | "greaterThan" | "lessThan";
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);

  // Process filter conditions
  const filteredData = useMemo(() => {
    return data.filter(row => {
      // First apply simple filters
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        
        const cellValue = String(row[key] || '').toLowerCase();
        if (!cellValue.includes(value.toLowerCase())) {
          return false;
        }
      }
      
      // Then apply advanced filter conditions
      for (const condition of filterConditions) {
        const cellValue = String(row[condition.column] || '');
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
      
      // Apply global search if provided
      if (searchQuery) {
        const searchFields = columns.filter(col => col.filterable || filterableColumns.includes(col.key)).map(col => col.key);
        return searchFields.some(field => 
          String(row[field] || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return true;
    });
  }, [data, filters, filterConditions, searchQuery, columns, filterableColumns]);

  const availableFilterColumns = columns.filter(col => 
    filterableColumns.includes(col.key) || col.filterable
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addFilterCondition = (column: string, value: string, operator: FilterCondition["operator"]) => {
    setFilterConditions(prev => [
      ...prev,
      { column, value, operator }
    ]);
    setActiveFilterColumn(null);
  };

  const removeFilterCondition = (index: number) => {
    setFilterConditions(prev => prev.filter((_, i) => i !== index));
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
    setFilterConditions([]);
    setSearchQuery("");
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

  // Determine if the column is numeric by checking first non-empty value
  const isNumericColumn = (columnKey: string) => {
    const sample = data.find(row => row[columnKey] !== undefined && row[columnKey] !== null);
    if (!sample) return false;
    return !isNaN(Number(sample[columnKey]));
  };

  // Get unique values for a column (for dropdown filters)
  const getUniqueValues = (columnKey: string) => {
    const uniqueValues = new Set<string>();
    data.forEach(row => {
      if (row[columnKey] !== undefined && row[columnKey] !== null) {
        uniqueValues.add(String(row[columnKey]));
      }
    });
    return Array.from(uniqueValues).sort();
  };

  // Helper to render operator dropdown for advanced filters
  const renderOperatorDropdown = (columnKey: string) => {
    const isNumeric = isNumericColumn(columnKey);
    
    return (
      <Select onValueChange={(value) => {
        // Create an empty condition that will be filled in with value later
        addFilterCondition(columnKey, '', value as FilterCondition["operator"]);
      }}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Chọn điều kiện" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="contains">Chứa</SelectItem>
          <SelectItem value="equals">Bằng</SelectItem>
          <SelectItem value="startsWith">Bắt đầu với</SelectItem>
          <SelectItem value="endsWith">Kết thúc với</SelectItem>
          {isNumeric && (
            <>
              <SelectItem value="greaterThan">Lớn hơn</SelectItem>
              <SelectItem value="lessThan">Nhỏ hơn</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="space-y-4">
      {/* Global search and filter controls */}
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
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Thêm bộ lọc
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {availableFilterColumns.map((column) => (
                <DropdownMenuItem 
                  key={column.key} 
                  onClick={() => setActiveFilterColumn(column.key)}
                  disabled={Boolean(filters[column.key])}
                >
                  {column.header}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(Object.keys(filters).length > 0 || filterConditions.length > 0 || searchQuery) && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="flex items-center gap-2"
            >
              <FilterX className="h-4 w-4" />
              Xóa tất cả
            </Button>
          )}
        </div>
      </div>
      
      {/* Active column for advanced filtering */}
      {activeFilterColumn && (
        <div className="p-4 border rounded-md bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="font-medium">{columns.find(col => col.key === activeFilterColumn)?.header}:</div>
            <div className="flex flex-wrap gap-2 flex-1">
              {renderOperatorDropdown(activeFilterColumn)}
              <Button variant="ghost" size="sm" onClick={() => setActiveFilterColumn(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Active filters display */}
      {(Object.keys(filters).length > 0 || filterConditions.length > 0) && (
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
          
          {filterConditions.map((condition, index) => {
            const column = columns.find(col => col.key === condition.column);
            
            // Translate operator for display
            let operatorText = "";
            switch(condition.operator) {
              case "contains": operatorText = "chứa"; break;
              case "equals": operatorText = "bằng"; break;
              case "startsWith": operatorText = "bắt đầu với"; break;
              case "endsWith": operatorText = "kết thúc với"; break;
              case "greaterThan": operatorText = ">"; break;
              case "lessThan": operatorText = "<"; break;
            }
            
            return (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                <span className="font-medium">{column?.header || condition.column}</span>
                <span>{operatorText}</span>
                <span>"{condition.value}"</span>
                <button 
                  onClick={() => removeFilterCondition(index)}
                  className="ml-2 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Advanced filter condition input for selected column */}
      {filterConditions.length > 0 && filterConditions.some(c => c.value === '') && (
        <div className="p-4 border rounded-md bg-muted/30">
          {filterConditions
            .filter(c => c.value === '')
            .map((condition, index) => {
              const column = columns.find(col => col.key === condition.column);
              
              const handleValueChange = (value: string) => {
                setFilterConditions(prev => 
                  prev.map((c, i) => 
                    i === prev.findIndex(fc => fc.value === '' && fc.column === condition.column) 
                      ? { ...c, value } 
                      : c
                  )
                );
              };
              
              // Check if column has predefined filter options
              const columnDef = columns.find(col => col.key === condition.column);
              const hasFilterOptions = columnDef?.filterOptions && columnDef.filterOptions.length > 0;
              
              return (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div>
                    <span className="font-medium">{column?.header || condition.column}</span>
                    <span className="mx-2">
                      {condition.operator === "contains" && "chứa"}
                      {condition.operator === "equals" && "bằng"}
                      {condition.operator === "startsWith" && "bắt đầu với"}
                      {condition.operator === "endsWith" && "kết thúc với"}
                      {condition.operator === "greaterThan" && "lớn hơn"}
                      {condition.operator === "lessThan" && "nhỏ hơn"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-1">
                    {hasFilterOptions ? (
                      <Select onValueChange={handleValueChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giá trị..." />
                        </SelectTrigger>
                        <SelectContent>
                          {columnDef?.filterOptions?.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        placeholder="Nhập giá trị..." 
                        className="flex-1"
                        onChange={(e) => handleValueChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            handleValueChange(e.currentTarget.value);
                          }
                        }}
                      />
                    )}
                    
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setFilterConditions(prev => prev.filter(c => !(c.value === '' && c.column === condition.column)));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

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
                              onChange={(e) => handleFilterChange(column.key, e.target.value)}
                            />
                            <div className="flex justify-between">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setActiveFilterColumn(column.key)}
                              >
                                Lọc nâng cao
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => clearFilter(column.key)}
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
