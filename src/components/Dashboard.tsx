
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stats from './Stats';
import FileUpload from './FileUpload';
import DataDisplay from './DataDisplay';
import { UploadedFile, AggregatedUserData } from '@/types';
import { aggregateDataByUID } from '@/utils/dataParser';
import { useToast } from '@/components/ui/use-toast';
import { BarChart3, Users, Database } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedUserData[]>([]);
  const { toast } = useToast();

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
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>Tải lên dữ liệu</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Dữ liệu người dùng</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Thống kê</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Tải lên và phân tích dữ liệu Facebook</h2>
              <p className="text-gray-500">Tải lên các file Excel chứa dữ liệu Facebook để phân tích và tổng hợp thông tin.</p>
            </div>
            <FileUpload onFilesUploaded={handleFilesUploaded} />
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <DataDisplay aggregatedData={aggregatedData} />
        </TabsContent>
        
        <TabsContent value="stats">
          <Stats aggregatedData={aggregatedData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
