import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stats from './Stats';
import FileUpload from './FileUpload';
import DataDisplay from './DataDisplay';
import { UploadedFile, AggregatedUserData, DataSourceType } from '@/types';
import { aggregateDataByUID } from '@/utils/dataParser';
import { useToast } from '@/components/ui/use-toast';
import { Database, Upload, History, Users, FileText, Eye, Brain, User, Folder, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { DataTable } from '@/components/ui/data-table';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DataDialog from './DataDialog';
import AIAnalysis from './AIAnalysis';

const LOCAL_STORAGE_FILES_KEY = 'uploadedFiles';
const LOCAL_STORAGE_AGGREGATED_DATA_KEY = 'aggregatedData';

const Dashboard: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedUserData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [userDataType, setUserDataType] = useState<'all' | 'profile' | 'group' | 'page'>('all');
  const [selectedFileData, setSelectedFileData] = useState<any[] | null>(null);
  const [isDataDialogOpen, setIsDataDialogOpen] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<AggregatedUserData | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem(LOCAL_STORAGE_FILES_KEY);
      const savedAggregatedData = localStorage.getItem(LOCAL_STORAGE_AGGREGATED_DATA_KEY);
      
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        const filesWithDates = parsedFiles.map((file: any) => ({
          ...file,
          uploadDate: new Date(file.uploadDate)
        }));
        setUploadedFiles(filesWithDates);
      }
      
      if (savedAggregatedData) {
        const parsedData = JSON.parse(savedAggregatedData);
        const dataWithDates = parsedData.map((item: any) => ({
          ...item,
          lastActive: item.lastActive ? new Date(item.lastActive) : null,
          sources: item.sources.map((source: any) => ({
            ...source,
            timestamp: new Date(source.timestamp)
          }))
        }));
        setAggregatedData(dataWithDates);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/upload" || path === "/") {
      setActiveTab("upload");
    } else if (path === "/history") {
      setActiveTab("history");
    } else if (path.includes("/users")) {
      setActiveTab("users");
      
      if (path === "/users/profile") {
        setUserDataType('profile');
      } else if (path === "/users/group") {
        setUserDataType('group');
      } else if (path === "/users/page") {
        setUserDataType('page');
      } else {
        setUserDataType('all');
      }
    } else if (path === "/stats") {
      setActiveTab("stats");
    }
  }, [location]);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_FILES_KEY, JSON.stringify(uploadedFiles));
    }
  }, [uploadedFiles]);

  useEffect(() => {
    if (aggregatedData.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_AGGREGATED_DATA_KEY, JSON.stringify(aggregatedData));
    }
  }, [aggregatedData]);

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

  const clearSavedData = () => {
    localStorage.removeItem(LOCAL_STORAGE_FILES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_AGGREGATED_DATA_KEY);
    setUploadedFiles([]);
    setAggregatedData([]);
    toast({
      title: "Đã xóa dữ liệu",
      description: "Tất cả dữ liệu đã được xóa khỏi trình duyệt.",
    });
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

  const filteredAggregatedData = useMemo(() => {
    if (userDataType === 'all') return aggregatedData;
    
    return aggregatedData.filter(user => {
      const hasProfileData = user.sources.some(source => 
        source.sourceType === DataSourceType.UID_PROFILE);
      const hasGroupData = user.sources.some(source => 
        source.sourceType === DataSourceType.GROUP);
      const hasPageData = user.sources.some(source => 
        source.sourceType === DataSourceType.PAGE);
      
      if (userDataType === 'profile') return hasProfileData;
      if (userDataType === 'group') return hasGroupData;
      if (userDataType === 'page') return hasPageData;
      return true;
    });
  }, [aggregatedData, userDataType]);

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

  const getUsersTabTitle = () => {
    switch(userDataType) {
      case 'profile':
        return "UID PROFILE";
      case 'group':
        return "UID GROUP";
      case 'page':
        return "UID PAGE";
      default:
        return "Dữ liệu người dùng";
    }
  };

  const getUsersTabIcon = () => {
    switch(userDataType) {
      case 'profile':
        return <User className="h-4 w-4 mr-1" />;
      case 'group':
        return <Folder className="h-4 w-4 mr-1" />;
      case 'page':
        return <FileText className="h-4 w-4 mr-1" />;
      default:
        return <Users className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:hidden mb-6">
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          if (value === 'upload') navigate('/upload');
          else if (value === 'history') navigate('/history');
          else if (value === 'users') navigate('/users');
          else if (value === 'stats') navigate('/stats');
        }} className="w-full">
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
              {getUsersTabIcon()}
              <span>{getUsersTabTitle()}</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Thống kê</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeTab === "users" && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            {getUsersTabIcon()}
            <span className="ml-2">{getUsersTabTitle()}</span>
          </h2>
          
          <Tabs value={userDataType} onValueChange={(value: any) => {
            setUserDataType(value);
            if (value === 'all') navigate('/users');
            else if (value === 'profile') navigate('/users/profile');
            else if (value === 'group') navigate('/users/group');
            else if (value === 'page') navigate('/users/page');
          }}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Tất cả</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>UID PROFILE</span>
              </TabsTrigger>
              <TabsTrigger value="group" className="flex items-center">
                <Folder className="h-4 w-4 mr-1" />
                <span>UID GROUP</span>
              </TabsTrigger>
              <TabsTrigger value="page" className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>UID PAGE</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Tổng quan dữ liệu</h3>
                  <Stats aggregatedData={filteredAggregatedData} condensed={true} />
                </div>
              </div>
              <div className="md:col-span-3">
                <DataDisplay 
                  aggregatedData={filteredAggregatedData} 
                  additionalColumns={[userActionColumn]}
                  onAIAnalysis={handleAIAnalysis}
                  onUserSelect={setSelectedUser}
                />
              </div>
            </div>
          </Tabs>
        </div>
      )}
      
      {activeTab === "upload" && (
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Tải lên và phân tích dữ liệu Facebook</h2>
            <p className="text-gray-500">Tải lên các file Excel chứa dữ liệu Facebook để phân tích và tổng hợp thông tin.</p>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mb-6 flex justify-center">
              <Button 
                variant="destructive" 
                onClick={clearSavedData}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Xóa tất cả dữ liệu
              </Button>
            </div>
          )}
          
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
