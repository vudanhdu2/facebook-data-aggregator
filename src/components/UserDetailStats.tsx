
import React, { useState, useMemo } from 'react';
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

// Define the props interface for StatCard
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  data?: any[];
  description?: string;
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

  // Memoize data to prevent unnecessary recalculations
  const postsData = useMemo(() => userData.data.posts || [], [userData.data.posts]);
  const commentsData = useMemo(() => userData.data.comments || [], [userData.data.comments]);
  const groupsData = useMemo(() => userData.data.groups || [], [userData.data.groups]);
  const pagesLikedData = useMemo(() => userData.data.pagesLiked || [], [userData.data.pagesLiked]);

  // Prepare timeline data - memoized to prevent recalculation
  const prepareTimelineData = (data: any[], dateField: string) => {
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
    
    return Object.entries(counts).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Memoize timeline data
  const postsTimeline = useMemo(() => prepareTimelineData(postsData, 'posted_at'), [postsData]);
  const wallPostsTimeline = postsTimeline;
  const groupPostsTimeline = useMemo(() => prepareTimelineData([], 'posted_at'), []);
  const commentsTimeline = useMemo(() => prepareTimelineData(commentsData, 'commented_at'), [commentsData]);
  const groupCommentsTimeline = useMemo(() => prepareTimelineData([], 'commented_at'), []);
  const pageCommentsTimeline = useMemo(() => prepareTimelineData([], 'commented_at'), []);

  // Memoized StatCard component for better performance - now with proper type definition
  const StatCard = React.memo<StatCardProps>(({ title, value, icon, data = [], description = '' }) => (
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
  ));

  // Decrease the amount of work in the render function
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
              value={0}
              icon={<Share2 className="h-5 w-5 text-primary" />}
            />
            <StatCard 
              title="Số cmt trên nhóm"
              value={0}
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
            />
            <StatCard 
              title="Số cmt trên page"
              value={0}
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
              value={0}
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
              value={0}
              icon={<UserCircle className="h-5 w-5 text-primary" />}
            />
          </div>
        </TabsContent>
        
        {/* Only render the active tab content to improve performance */}
        {activeTab === "posts" && (
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
                        tick={{ fontSize: 12 }}
                        interval={wallPostsTimeline.length > 10 ? Math.ceil(wallPostsTimeline.length / 10) : 0}
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
        )}

        {activeTab === "activities" && (
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
                          tick={{ fontSize: 12 }}
                          interval={commentsTimeline.length > 10 ? Math.ceil(commentsTimeline.length / 10) : 0}
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
        )}
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
