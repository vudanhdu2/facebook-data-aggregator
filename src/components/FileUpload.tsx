
import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle, Calendar, UserCircle, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadedFile, FacebookDataType, FILE_TYPE_OPTIONS, DataSourceType, DATA_SOURCE_OPTIONS } from '@/types';
import { readExcelFile } from '@/utils/dataParser';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<FacebookDataType | null>(null);
  const [selectedSourceType, setSelectedSourceType] = useState<DataSourceType>(DataSourceType.UID_PROFILE);
  const [sourceUID, setSourceUID] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File, manualType?: FacebookDataType) => {
    try {
      const result = await readExcelFile(file);
      if (result) {
        // If a manual type was selected, override the auto-detected type
        if (manualType) {
          result.type = manualType;
          result.manualType = true;
        }
        
        // Add the source type and UID to the file data
        result.sourceType = selectedSourceType;
        if (sourceUID.trim()) {
          result.sourceUID = sourceUID.trim();
        }
        
        return result;
      }
    } catch (error) {
      console.error("Error processing file:", file.name, error);
      toast({
        title: "Lỗi xử lý file",
        description: `Không thể xử lý file ${file.name}. Vui lòng đảm bảo đây là file Excel hợp lệ.`,
        variant: "destructive"
      });
    }
    return null;
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);
    
    const newFiles = Array.from(e.dataTransfer.files).filter(
      file => file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
    );
    
    if (newFiles.length === 0) {
      toast({
        title: "Định dạng không hỗ trợ",
        description: "Chỉ có thể tải lên các file Excel (.xls hoặc .xlsx)",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }
    
    const processedFiles = await Promise.all(
      newFiles.map(file => processFile(file, selectedFileType || undefined))
    );
    const validFiles = processedFiles.filter(Boolean) as UploadedFile[];
    
    setFiles(prevFiles => {
      const combinedFiles = [...prevFiles, ...validFiles];
      onFilesUploaded(combinedFiles);
      return combinedFiles;
    });
    
    setIsProcessing(false);
    toast({
      title: "Tải lên thành công",
      description: `Đã tải lên ${validFiles.length} file dữ liệu Facebook.`
    });
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsProcessing(true);
    const newFiles = Array.from(e.target.files).filter(
      file => file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
    );
    
    if (newFiles.length === 0) {
      toast({
        title: "Định dạng không hỗ trợ",
        description: "Chỉ có thể tải lên các file Excel (.xls hoặc .xlsx)",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }
    
    const processedFiles = await Promise.all(
      newFiles.map(file => processFile(file, selectedFileType || undefined))
    );
    const validFiles = processedFiles.filter(Boolean) as UploadedFile[];
    
    setFiles(prevFiles => {
      const combinedFiles = [...prevFiles, ...validFiles];
      onFilesUploaded(combinedFiles);
      return combinedFiles;
    });
    
    setIsProcessing(false);
    e.target.value = '';
    
    toast({
      title: "Tải lên thành công",
      description: `Đã tải lên ${validFiles.length} file dữ liệu Facebook.`
    });
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  const updateFileType = (fileIndex: number, newType: FacebookDataType) => {
    const updatedFiles = [...files];
    updatedFiles[fileIndex] = {
      ...updatedFiles[fileIndex],
      type: newType,
      manualType: true
    };
    
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
    
    toast({
      title: "Đã cập nhật loại dữ liệu",
      description: `File "${files[fileIndex].name}" đã được cập nhật thành ${getFacebookDataTypeLabel(newType)}`
    });
  };
  
  const updateSourceType = (fileIndex: number, newSourceType: DataSourceType) => {
    const updatedFiles = [...files];
    updatedFiles[fileIndex] = {
      ...updatedFiles[fileIndex],
      sourceType: newSourceType
    };
    
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
    
    toast({
      title: "Đã cập nhật nguồn dữ liệu",
      description: `File "${files[fileIndex].name}" đã được cập nhật thành ${getDataSourceTypeLabel(newSourceType)}`
    });
  };
  
  const updateSourceUID = (fileIndex: number, newUID: string) => {
    const updatedFiles = [...files];
    updatedFiles[fileIndex] = {
      ...updatedFiles[fileIndex],
      sourceUID: newUID.trim() || undefined
    };
    
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
    
    toast({
      title: "Đã cập nhật UID nguồn",
      description: `File "${files[fileIndex].name}" đã được cập nhật với UID: ${newUID || 'Không có'}`
    });
  };

  const getFacebookDataTypeLabel = (type: FacebookDataType): string => {
    const option = FILE_TYPE_OPTIONS.find(opt => opt.value === type);
    return option ? option.label : 'Không xác định';
  };
  
  const getDataSourceTypeLabel = (type: DataSourceType): string => {
    const option = DATA_SOURCE_OPTIONS.find(opt => opt.value === type);
    return option ? option.label : 'Hồ sơ người dùng';
  };
  
  const getSourceTypeIcon = (sourceType: DataSourceType) => {
    switch (sourceType) {
      case DataSourceType.UID_PROFILE:
        return <UserCircle className="h-3 w-3 mr-1" />;
      case DataSourceType.PAGE:
        return <FileText className="h-3 w-3 mr-1" />;
      case DataSourceType.GROUP:
        return <Users className="h-3 w-3 mr-1" />;
      default:
        return <UserCircle className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                value={selectedFileType || undefined}
                onValueChange={(value) => setSelectedFileType(value as FacebookDataType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại dữ liệu (tùy chọn)" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {FILE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={selectedSourceType}
                onValueChange={(value) => setSelectedSourceType(value as DataSourceType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn nguồn dữ liệu" />
                </SelectTrigger>
                <SelectContent>
                  {DATA_SOURCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="sm:col-span-2">
                <Input 
                  placeholder="Nhập UID nguồn (nếu có)" 
                  value={sourceUID}
                  onChange={(e) => setSourceUID(e.target.value)}
                  className="mb-3"
                />
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Chọn file
                </Button>
              </div>
            </div>

            <div
              className={`file-drop-area ${isDragging ? 'border-primary bg-primary/10' : ''} ${isProcessing ? 'opacity-60 cursor-wait' : ''} border-2 border-dashed rounded-lg p-8 text-center`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".xls,.xlsx"
                multiple
                className="hidden"
                disabled={isProcessing}
              />
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <div className="text-center">
                <p className="font-medium text-gray-700 mb-1">Kéo thả file hoặc nhấn để chọn</p>
                <p className="text-sm text-gray-500">Chỉ hỗ trợ file Excel (.xls, .xlsx)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-lg mb-3">Files đã tải lên</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span>{file.rowCount} dòng</span>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{format(file.uploadDate, 'dd/MM/yyyy HH:mm')}</span>
                        </div>
                        <div className="flex items-center">
                          {getSourceTypeIcon(file.sourceType)}
                          <span>{getDataSourceTypeLabel(file.sourceType)}</span>
                        </div>
                        {file.sourceUID && (
                          <div className="flex items-center">
                            <span className="font-medium">UID: {file.sourceUID}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          {file.sourceUID ? (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                              {file.sourceUID}
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Nhập UID
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">UID Nguồn</h4>
                          <Input 
                            placeholder="Nhập UID" 
                            defaultValue={file.sourceUID || ''}
                            onChange={(e) => updateSourceUID(index, e.target.value)}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                            {getFacebookDataTypeLabel(file.type)}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Chọn loại dữ liệu</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {FILE_TYPE_OPTIONS.map((option) => (
                          <DropdownMenuItem 
                            key={option.value}
                            onClick={() => updateFileType(index, option.value)}
                            className={file.type === option.value ? "bg-primary/10" : ""}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center">
                            {getSourceTypeIcon(file.sourceType)}
                            {getDataSourceTypeLabel(file.sourceType)}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Chọn nguồn dữ liệu</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {DATA_SOURCE_OPTIONS.map((option) => (
                          <DropdownMenuItem 
                            key={option.value}
                            onClick={() => updateSourceType(index, option.value)}
                            className={file.sourceType === option.value ? "bg-primary/10" : ""}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {file.processed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
