
import React, { useState, useEffect } from 'react';
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
  data: any[];
}

const DataDialog: React.FC<DataDialogProps> = ({ isOpen, onClose, title, description, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [paginatedData, setPaginatedData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 15;

  // Extract columns from first data item
  const columns = data.length ? Object.keys(data[0]) : [];
  
  // Effect to handle filtering and pagination of data
  useEffect(() => {
    setIsLoading(true);
    
    // Use setTimeout to prevent UI freezing when dealing with large datasets
    const timer = setTimeout(() => {
      // Filter data based on search query
      const filtered = searchQuery 
        ? data.filter(item => 
            columns.some(column => 
              String(item[column]).toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
        : data;
      
      setFilteredData(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      
      // Reset to first page if current page is now out of bounds
      if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
        setCurrentPage(1);
      }
      
      // Calculate paginated data
      const startIndex = (currentPage - 1) * itemsPerPage;
      setPaginatedData(filtered.slice(startIndex, startIndex + itemsPerPage));
      
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, data, columns]);
  
  // Reset to first page when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setSearchQuery('');
    }
  }, [isOpen]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Check if previous/next buttons should be active
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  if (!data.length) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title} ({filteredData.length} bản ghi)</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
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
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                
                // Logic for showing pages around the current page
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return pageNum > 0 && pageNum <= totalPages ? (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === pageNum}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ) : null;
              })}
              
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
      </DialogContent>
    </Dialog>
  );
};

export default DataDialog;
