
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface DataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  data?: any[];
  children?: React.ReactNode;
  wide?: boolean;
}

const DataDialog: React.FC<DataDialogProps> = ({ isOpen, onClose, title, description, data = [], children, wide = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 15;

  // Extract columns from first data item - memoized to prevent recalculations
  const columns = useMemo(() => {
    return data.length ? Object.keys(data[0]) : [];
  }, [data.length ? data[0] : null]);
  
  // Memoize filtered data to prevent recalculation on every render
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter(item => 
      columns.some(column => 
        String(item[column]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, columns]);
  
  // Calculate total pages once when filtered data changes
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData.length, itemsPerPage]);
  
  // Get current page data - memoized to prevent recalculation
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);
  
  // Reset to first page when dialog opens or search changes
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen, searchQuery]);
  
  // Handle data loading state
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // Use a small timeout to prevent UI freezing
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, filteredData]);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }, []);
  
  // Check if previous/next buttons should be active
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  // Pagination item renderer - optimizes the pagination display
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = 1;
    let endPage = totalPages;
    
    if (totalPages > maxVisiblePages) {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      if (currentPage <= halfVisible + 1) {
        // Near the start
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        // Near the end
        startPage = totalPages - maxVisiblePages + 1;
      } else {
        // In the middle
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-${wide ? '[90vw]' : '[90vw]'} max-h-[90vh]`}>
        <DialogHeader>
          <DialogTitle>{title} {data.length > 0 && `(${filteredData.length} bản ghi)`}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        {children ? (
          children
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <ScrollArea className="h-[60vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Show loading state
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <TableRow key={`loading-${index}`}>
                        {columns.map((column, colIndex) => (
                          <TableCell key={`loading-${index}-${colIndex}`}>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : paginatedData.length > 0 ? (
                    // Show data
                    paginatedData.map((item, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={`${index}-${column}`}>
                            {typeof item[column] === 'object' && item[column] instanceof Date 
                              ? formatDate(item[column])
                              : typeof item[column] === 'object' && item[column] !== null
                              ? JSON.stringify(item[column])
                              : String(item[column])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    // No results
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center py-8">
                        Không tìm thấy kết quả phù hợp
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => !isPreviousDisabled && handlePageChange(currentPage - 1)}
                      className={isPreviousDisabled ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(totalPages)}>
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => !isNextDisabled && handlePageChange(currentPage + 1)}
                      className={isNextDisabled ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            <DialogFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                {isLoading ? (
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Đang xử lý dữ liệu...
                  </div>
                ) : (
                  `Hiển thị ${paginatedData.length} / ${filteredData.length} bản ghi`
                )}
              </div>
              <Button onClick={onClose}>Đóng</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DataDialog;
