
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stats from './Stats';
import FileUpload from './FileUpload';
import DataDisplay from './DataDisplay';
import { UploadedFile, AggregatedUserData } from '@/types';
import { aggregateDataByUID } from '@/utils/dataParser';
import { useToast } from '@/components/ui/use-toast';
import { Database, Upload, History, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { DataTable } from '@/components/ui/data-table';
import { formatDate } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedUserData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const { toast } = useToast();
  const location = useLocation();
  const { user } = useAuth();

  // Set active tab based on location
  useEffect(() => {
    const path = location.pathname;
    if (path === "/upload" || path === "/") {
      setActiveTab("upload");
    } else if (path === "/history") {
      setActiveTab("history");
    } else if (path === "/users") {
      setActiveTab("users");
    } else if (path === "/stats") {
      setActiveTab("stats");
    }
  }, [location]);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    // Add uploader info and unique ID to each file if missing
    const filesWithUploader = files.map(file => ({
      ...file,
      id: file.id || uuidv4(),
      uploaderId: file.uploaderId || user?.id || 'anonymous',
      uploaderName: file.uploaderName || user?.name || user?.email || 'Anonymous User'
    }));
    
    setUploadedFiles(filesWithUploader);
    
    try {
      const aggregated = aggregateDataByUID(filesWithUploader);
      setAggregatedData(aggregated);
      
      toast({
        title: "Dữ liệu đã được phân tích",
        description: `Đã tổng hợp thông tin của ${aggregated.length} người dùng.`,
      });
    } catch (error) {
      console.error("Error aggregating data:", error);
      toast({
        title: "Lỗi xử lý dữ liệu",
        description: "Không thể tổng hợp dữ liệu. Vui lòng kiểm tra định dạng file.",
        variant: "destructive"
      });
    }
  };

  // Get only the files uploaded by the current user if not admin
  const userFiles = user?.role === 'admin' 
    ? uploadedFiles 
    : uploadedFiles.filter(file => file.uploaderId === user?.id);
    
  // Define columns for the history data table
  const historyColumns = [
    { key: 'name', header: 'Tên file', filterable: true },
    { key: 'type', header: 'Loại dữ liệu', filterable: true },
    { key: 'uploaderName', header: 'Người tải lên', filterable: true },
    { key: 'rowCount', header: 'Số lượng dòng', filterable: true },
    { 
      key: 'uploadDate', 
      header: 'Ngày giờ tải lên', 
      filterable: true,
      render: (value: Date) => formatDate(value)
    },
    { 
      key: 'size', 
      header: 'Kích thước', 
      filterable: true, 
      render: (value: number, row: any) => 
        row.size ? `${(row.size / 1024).toFixed(2)} KB` : 'N/A'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:hidden mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              <span>Tải lên</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>Lịch sử</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Người dùng</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeTab === "upload" && (
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Tải lên và phân tích dữ liệu Facebook</h2>
            <p className="text-gray-500">Tải lên các file Excel chứa dữ liệu Facebook để phân tích và tổng hợp thông tin.</p>
          </div>
          <FileUpload onFilesUploaded={handleFilesUploaded} />
        </div>
      )}
      
      {activeTab === "history" && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Lịch sử tải lên</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {userFiles.length > 0 ? (
              <DataTable 
                data={userFiles}
                columns={historyColumns}
                filterableColumns={['name', 'type', 'uploaderName', 'rowCount', 'uploadDate']}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có lịch sử tải lên nào</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === "users" && (
        <DataDisplay aggregatedData={aggregatedData} />
      )}
      
      {activeTab === "stats" && (
        <Stats aggregatedData={aggregatedData} />
      )}
    </div>
  );
};

export default Dashboard;
