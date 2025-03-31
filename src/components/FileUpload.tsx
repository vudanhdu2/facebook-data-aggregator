
import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadedFile, FacebookDataType } from '@/types';
import { readExcelFile } from '@/utils/dataParser';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    try {
      const result = await readExcelFile(file);
      if (result) {
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
    
    const processedFiles = await Promise.all(newFiles.map(processFile));
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
    
    const processedFiles = await Promise.all(newFiles.map(processFile));
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

  const getFacebookDataTypeLabel = (type: FacebookDataType): string => {
    switch (type) {
      case FacebookDataType.FRIENDS: return 'Danh sách bạn bè';
      case FacebookDataType.GROUPS: return 'Danh sách nhóm';
      case FacebookDataType.POSTS: return 'Danh sách bài đăng';
      case FacebookDataType.COMMENTS: return 'Danh sách bình luận';
      case FacebookDataType.PAGES_LIKED: return 'Danh sách trang đã thích';
      case FacebookDataType.CHECK_INS: return 'Danh sách địa điểm đã check-in';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardContent className="pt-6">
          <div
            className={`file-drop-area ${isDragging ? 'border-primary bg-primary/10' : ''} ${isProcessing ? 'opacity-60 cursor-wait' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
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
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{file.rowCount} dòng</span>
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                          {getFacebookDataTypeLabel(file.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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
