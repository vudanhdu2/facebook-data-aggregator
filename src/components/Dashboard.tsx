import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stats from './Stats';
import FileUpload from './FileUpload';
import DataDisplay from './DataDisplay';
import { UploadedFile, AggregatedUserData } from '@/types';
import { aggregateDataByUID } from '@/utils/dataParser';
import { useToast } from '@/components/ui/use-toast';
import { Database, Upload, History, Users, FileText, Eye, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { DataTable } from '@/components/ui/data-table';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DataDialog from './DataDialog';
import AIAnalysis from './AIAnalysis';

const Dashboard: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedUserData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [selectedFileData, setSelectedFileData] = useState<any[] | null>(null);
  const [isDataDialogOpen, setIsDataDialogOpen] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<AggregatedUserData | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const location = useLocation();
  const { user } = useAuth();

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

  const userFiles = user?.role === 'admin' 
    ? uploadedFiles 
    : uploadedFiles.filter(file => file.uploaderId === user?.id);
    
  const handleViewData = (file: UploadedFile) => {
    if (file && file.data) {
      setSelectedFileData(file.data);
      setSelectedFileName(file.name);
      setIsDataDialogOpen(true);
    } else {
      toast({
        title: "Không có dữ liệu",
        description: "Không thể tìm thấy dữ liệu cho file này.",
        variant: "destructive"
      });
    }
  };

  const handleAIAnalysis = (userData: AggregatedUserData) => {
    setSelectedUser(userData);
    setIsAIDialogOpen(true);
  };

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
    },
    {
      key: 'actions',
      header: 'Xem dữ liệu',
      render: (_: any, row: UploadedFile) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-primary"
          onClick={() => handleViewData(row)}
        >
          <Eye className="h-4 w-4" />
          <span>Xem</span>
        </Button>
      )
    }
  ];

  const userActionColumn = {
    key: 'aiAnalysis',
    header: 'Phân tích AI',
    render: (_: any, row: any) => (
      <Button 
        variant="secondary" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => handleAIAnalysis(row.userData)}
      >
        <Brain className="h-4 w-4" />
        <span>Phân tích</span>
      </Button>
    )
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:hidden mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4">
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
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Thống kê</span>
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
        <DataDisplay 
          aggregatedData={aggregatedData} 
          additionalColumns={[userActionColumn]}
          onAIAnalysis={handleAIAnalysis}
        />
      )}
      
      {activeTab === "stats" && (
        <Stats aggregatedData={aggregatedData} />
      )}

      <DataDialog 
        isOpen={isDataDialogOpen} 
        onClose={() => setIsDataDialogOpen(false)}
        title={`Dữ liệu file: ${selectedFileName}`}
        description="Chi tiết dữ liệu trong file đã tải lên"
        data={selectedFileData || []}
      />
      
      <DataDialog 
        isOpen={isAIDialogOpen} 
        onClose={() => setIsAIDialogOpen(false)}
        title={`Phân tích AI: ${selectedUser?.name || 'Người dùng'}`}
        description="Phân tích dữ liệu người dùng bằng AI"
        wide={true}
      >
        {selectedUser && (
          <AIAnalysis 
            userData={selectedUser} 
            allUserData={aggregatedData} 
          />
        )}
      </DataDialog>
    </div>
  );
};

export default Dashboard;
