
import React, { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

export interface FilterCondition {
  field: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  value: string;
}

interface DataFilterProps {
  columns: { key: string; header: string; filterable?: boolean }[];
  onFilterChange: (filters: FilterCondition[]) => void;
  activeFilters?: FilterCondition[];
}

export function DataFilter({ 
  columns, 
  onFilterChange, 
  activeFilters = [] 
}: DataFilterProps) {
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<FilterCondition['operator']>('contains');
  const [filterValue, setFilterValue] = useState<string>('');
  
  const filterableColumns = columns.filter(col => col.filterable);
  
  const addFilter = () => {
    if (!selectedField || !filterValue) return;
    
    const newFilter: FilterCondition = {
      field: selectedField,
      operator: selectedOperator,
      value: filterValue
    };
    
    onFilterChange([...activeFilters, newFilter]);
    resetFilterInputs();
  };
  
  const removeFilter = (index: number) => {
    const newFilters = [...activeFilters];
    newFilters.splice(index, 1);
    onFilterChange(newFilters);
  };
  
  const resetFilterInputs = () => {
    setSelectedField('');
    setSelectedOperator('contains');
    setFilterValue('');
  };
  
  const clearAllFilters = () => {
    onFilterChange([]);
  };
  
  const getOperatorLabel = (operator: FilterCondition['operator']) => {
    switch(operator) {
      case 'contains': return 'chứa';
      case 'equals': return 'bằng';
      case 'startsWith': return 'bắt đầu với';
      case 'endsWith': return 'kết thúc với';
      case 'greaterThan': return '>';
      case 'lessThan': return '<';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Thêm bộ lọc</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-2">
              <div className="grid gap-2">
                <Select 
                  value={selectedField} 
                  onValueChange={setSelectedField}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trường" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterableColumns.map(column => (
                      <SelectItem key={column.key} value={column.key}>
                        {column.header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedField && (
                  <>
                    <Select 
                      value={selectedOperator} 
                      onValueChange={(value) => setSelectedOperator(value as FilterCondition['operator'])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn điều kiện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Chứa</SelectItem>
                        <SelectItem value="equals">Bằng</SelectItem>
                        <SelectItem value="startsWith">Bắt đầu với</SelectItem>
                        <SelectItem value="endsWith">Kết thúc với</SelectItem>
                        <SelectItem value="greaterThan">Lớn hơn</SelectItem>
                        <SelectItem value="lessThan">Nhỏ hơn</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Giá trị lọc"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                    />
                    
                    <Button onClick={addFilter} disabled={!filterValue}>
                      Áp dụng bộ lọc
                    </Button>
                  </>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {activeFilters.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1" 
            onClick={clearAllFilters}
          >
            <X className="h-3.5 w-3.5" />
            <span>Xóa tất cả bộ lọc</span>
          </Button>
        )}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {activeFilters.map((filter, index) => {
            const column = columns.find(col => col.key === filter.field);
            return (
              <Badge key={index} variant="secondary" className="h-6 px-2 text-xs gap-1">
                <span className="font-medium">{column?.header || filter.field}</span>
                <span>{getOperatorLabel(filter.operator)}</span>
                <span>"{filter.value}"</span>
                <button 
                  onClick={() => removeFilter(index)}
                  className="ml-1 h-3.5 w-3.5 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
