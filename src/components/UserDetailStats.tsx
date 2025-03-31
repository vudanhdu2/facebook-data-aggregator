
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AggregatedUserData } from '@/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { 
  MessageCircle, Share2, Users, UserCircle, ThumbsUp, 
  MapPin, Calendar, FileText
} from 'lucide-react';
import DataDialog from './DataDialog';

interface UserDetailStatsProps {
  userData: AggregatedUserData;
}

const UserDetailStats: React.FC<UserDetailStatsProps> = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dialogData, setDialogData] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    data: any[];
  }>({
    isOpen: false,
    title: '',
    description: '',
    data: [],
  });

  const handleStatClick = (title: string, data: any[], description?: string) => {
    setDialogData({
      isOpen: true,
      title,
      description,
      data,
    });
  };

  const handleCloseDialog = () => {
    setDialogData(prev => ({ ...prev, isOpen: false }));
  };

  const postsData = userData.data.posts || [];
  const commentsData = userData.data.comments || [];
  const groupsData = userData.data.groups || [];
  const pagesLikedData = userData.data.pagesLiked || [];

  // Prepare data for charts
  const prepareTimelineData = (data: any[], dateField: string) => {
    // Group by date and count
    const counts = {};
    
    data.forEach(item => {
      const date = item[dateField];
      if (date) {
        const formattedDate = typeof date === 'string' ? date.split('T')[0] : '';
        if (formattedDate) {
          counts[formattedDate] = (counts[formattedDate] || 0) + 1;
        }
      }
    });
    
    // Convert to array for chart
    return Object.entries(counts).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  const postsTimeline = prepareTimelineData(postsData, 'posted_at');
  const wallPostsTimeline = postsTimeline;
  const groupPostsTimeline = prepareTimelineData([], 'posted_at'); // This would need group post data
  const commentsTimeline = prepareTimelineData(commentsData, 'commented_at');
  const groupCommentsTimeline = prepareTimelineData([], 'commented_at'); // This would need group comments data
  const pageCommentsTimeline = prepareTimelineData([], 'commented_at'); // This would need page comments data

  // Stats cards with clickable functionality
  const StatCard = ({ title, value, icon, data = [], description = '' }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatClick(title, data, description)}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          {icon}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="posts">Bài đăng</TabsTrigger>
          <TabsTrigger value="activities">Hoạt động</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Số bài đăng trên tường"
              value={userData.postsCount}
              icon={<FileText className="h-5 w-5 text-primary" />}
              data={postsData}
              description="Chi tiết các bài đăng trên tường cá nhân"
            />
            <StatCard 
              title="Số cmt trên tường"
              value={userData.commentsCount}
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
              data={commentsData}
            />
            <StatCard 
              title="Số bài đăng trên nhóm"
              value={0} // Would need to be calculated from data
              icon={<Share2 className="h-5 w-5 text-primary" />}
            />
            <StatCard 
              title="Số cmt trên nhóm"
              value={0} // Would need to be calculated from data
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
            />
            <StatCard 
              title="Số cmt trên page"
              value={0} // Would need to be calculated from data
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
            />
            <StatCard 
              title="Số page đã like"
              value={userData.pagesLikedCount}
              icon={<ThumbsUp className="h-5 w-5 text-primary" />}
              data={pagesLikedData}
            />
            <StatCard 
              title="Số page đã check in"
              value={userData.checkInsCount}
              icon={<MapPin className="h-5 w-5 text-primary" />}
              data={userData.data.checkIns || []}
            />
            <StatCard 
              title="Số event tham gia"
              value={0} // Would need to be calculated from data
              icon={<Calendar className="h-5 w-5 text-primary" />}
            />
            <StatCard 
              title="Số nhóm đã tham gia"
              value={userData.groupsCount}
              icon={<Users className="h-5 w-5 text-primary" />}
              data={groupsData}
            />
            <StatCard 
              title="Số người tương tác"
              value={0} // Would need to be calculated from data 
              icon={<UserCircle className="h-5 w-5 text-primary" />}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="posts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bài đăng theo thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={wallPostsTimeline}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="Số bài đăng" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bài đăng trên nhóm theo thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {groupPostsTimeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={groupPostsTimeline}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Số bài đăng nhóm" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Không có dữ liệu bài đăng nhóm
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bình luận theo thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {commentsTimeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={commentsTimeline}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Số bình luận" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Không có dữ liệu bình luận
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bình luận trên nhóm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  {groupCommentsTimeline.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={groupCommentsTimeline}
                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" name="Bình luận nhóm" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Không có dữ liệu bình luận nhóm
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bình luận trên trang</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  {pageCommentsTimeline.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={pageCommentsTimeline}
                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" name="Bình luận trang" stroke="#ffc658" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Không có dữ liệu bình luận trang
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <DataDialog
        isOpen={dialogData.isOpen}
        onClose={handleCloseDialog}
        title={dialogData.title}
        description={dialogData.description}
        data={dialogData.data}
      />
    </div>
  );
};

export default UserDetailStats;
