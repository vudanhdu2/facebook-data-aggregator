
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, AlertTriangle, Lightbulb } from 'lucide-react';
import { AggregatedUserData } from '@/types';
import { generateAIAnalysis, findConnections } from '@/utils/aiAnalysis';

interface AIAnalysisProps {
  userData: AggregatedUserData;
  allUserData?: AggregatedUserData[];
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ userData, allUserData = [] }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [networkInsights, setNetworkInsights] = useState<string | null>(null);

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateAIAnalysis(userData);
      setAnalysis(result);
    } catch (err) {
      setError("Không thể phân tích dữ liệu. Vui lòng thử lại sau.");
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const runNetworkAnalysis = async () => {
    if (!allUserData || allUserData.length <= 1) {
      setNetworkInsights("Cần có dữ liệu của ít nhất 2 người dùng để phân tích mạng lưới.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Find user's connections with other users
      const relevantData = [userData, ...allUserData.filter(u => u.uid !== userData.uid)];
      const { insights } = await findConnections(relevantData);
      setNetworkInsights(insights);
    } catch (err) {
      setError("Không thể phân tích mạng lưới. Vui lòng thử lại sau.");
      console.error("Network analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format analysis text with markdown-like styling
  const formatAnalysisText = (text: string) => {
    if (!text) return [];
    
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h2 key={index} className="text-xl font-bold mt-4 mb-2">
            {line.substring(2)}
          </h2>
        );
      } else if (line.startsWith('## ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-3 mb-1">
            {line.substring(3)}
          </h3>
        );
      } else if (line.trim() === '') {
        return <div key={index} className="my-2"></div>;
      } else {
        return <p key={index} className="my-1">{line}</p>;
      }
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Phân tích AI</h3>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Cơ bản</TabsTrigger>
            <TabsTrigger value="network">Mạng lưới</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="basic" className="space-y-4">
        {!analysis && !isLoading && !error && (
          <div className="bg-muted/30 border rounded-lg p-6 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">Phân tích dữ liệu người dùng</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AI sẽ phân tích dữ liệu người dùng để cung cấp thông tin chi tiết về UID này.
            </p>
            <Button onClick={runAnalysis} className="mx-auto">
              Bắt đầu phân tích
            </Button>
          </div>
        )}
        
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-2/4 mt-6" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {analysis && !isLoading && (
          <div className="bg-white border rounded-lg p-6">
            {formatAnalysisText(analysis)}
            <Button onClick={runAnalysis} className="mt-4" variant="outline">
              Phân tích lại
            </Button>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="network" className="space-y-4">
        {!networkInsights && !isLoading && (
          <div className="bg-muted/30 border rounded-lg p-6 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">Phân tích mạng lưới</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Hiểu mối quan hệ và kết nối giữa người dùng này với những người dùng khác.
            </p>
            <Button onClick={runNetworkAnalysis} className="mx-auto">
              Phân tích mạng lưới
            </Button>
          </div>
        )}
        
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        )}
        
        {networkInsights && !isLoading && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-medium text-lg mb-3">Kết quả phân tích mạng lưới</h3>
            <p>{networkInsights}</p>
            <Button onClick={runNetworkAnalysis} className="mt-4" variant="outline">
              Phân tích lại
            </Button>
          </div>
        )}
      </TabsContent>
    </div>
  );
};

export default AIAnalysis;
