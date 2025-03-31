
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

const Dashboard: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedUserData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const { toast } = useToast();
  const location = useLocation();

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
    setUploadedFiles(files);
    
    try {
      const aggregated = aggregateDataByUID(files);
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
            {uploadedFiles.length > 0 ? (
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{file.rowCount} dòng dữ liệu</p>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {file.type}
                    </span>
                  </div>
                ))}
              </div>
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
