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

  const postsData = useMemo(() => userData.data.posts?.filter(post => post.post_type === 'wall') || [], [userData.data.posts]);
  const commentsData = useMemo(() => userData.data.comments?.filter(comment => comment.comment_type === 'wall') || [], [userData.data.comments]);
  const groupPostsData = useMemo(() => userData.data.posts?.filter(post => post.post_type === 'group') || [], [userData.data.posts]);
  const groupCommentsData = useMemo(() => userData.data.comments?.filter(comment => comment.comment_type === 'group') || [], [userData.data.comments]);
  const pageCommentsData = useMemo(() => userData.data.comments?.filter(comment => comment.comment_type === 'page') || [], [userData.data.comments]);
  const groupsData = useMemo(() => userData.data.groups || [], [userData.data.groups]);
  const pagesLikedData = useMemo(() => userData.data.pagesLiked || [], [userData.data.pagesLiked]);
  const checkInsData = useMemo(() => userData.data.checkIns || [], [userData.data.checkIns]);
  const eventsData = useMemo(() => userData.data.events || [], [userData.data.events]);
  const interactionsData = useMemo(() => userData.data.interactions || [], [userData.data.interactions]);

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

  const postsTimeline = useMemo(() => prepareTimelineData(postsData, 'posted_at'), [postsData]);
  const wallPostsTimeline = postsTimeline;
  const groupPostsTimeline = useMemo(() => prepareTimelineData(groupPostsData, 'posted_at'), [groupPostsData]);
  const commentsTimeline = useMemo(() => prepareTimelineData(commentsData, 'commented_at'), [commentsData]);
  const groupCommentsTimeline = useMemo(() => prepareTimelineData(groupCommentsData, 'commented_at'), [groupCommentsData]);
  const pageCommentsTimeline = useMemo(() => prepareTimelineData(pageCommentsData, 'commented_at'), [pageCommentsData]);

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

  const wallPostsCount = postsData.length;
  const wallCommentsCount = commentsData.length;
  const groupPostsCount = groupPostsData.length;
  const groupCommentsCount = groupCommentsData.length;
  const pageCommentsCount = pageCommentsData.length;
  const pagesLikedCount = userData.pagesLikedCount;
  const checkInsCount = userData.checkInsCount;
  const eventsCount = eventsData.length;
  const groupsCount = userData.groupsCount;
  const interactionsCount = interactionsData.length;

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
              value={wallPostsCount}
              icon={<FileText className="h-5 w-5 text-primary" />}
              data={postsData}
              description="Chi tiết các bài đăng trên tường cá nhân"
            />
            <StatCard 
              title="Số cmt trên tường"
              value={wallCommentsCount}
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
              data={commentsData}
            />
            <StatCard 
              title="Số bài đăng trên nhóm"
              value={groupPostsCount}
              icon={<Share2 className="h-5 w-5 text-primary" />}
              data={groupPostsData}
            />
            <StatCard 
              title="Số cmt trên nhóm"
              value={groupCommentsCount}
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
              data={groupCommentsData}
            />
            <StatCard 
              title="Số cmt trên page"
              value={pageCommentsCount}
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
              data={pageCommentsData}
            />
            <StatCard 
              title="Số page đã like"
              value={pagesLikedCount}
              icon={<ThumbsUp className="h-5 w-5 text-primary" />}
              data={pagesLikedData}
            />
            <StatCard 
              title="Số page đã check in"
              value={checkInsCount}
              icon={<MapPin className="h-5 w-5 text-primary" />}
              data={checkInsData}
            />
            <StatCard 
              title="Số event tham gia"
              value={eventsCount}
              icon={<Calendar className="h-5 w-5 text-primary" />}
              data={eventsData}
            />
            <StatCard 
              title="Số nhóm đã tham gia"
              value={groupsCount}
              icon={<Users className="h-5 w-5 text-primary" />}
              data={groupsData}
            />
            <StatCard 
              title="Số người tương tác"
              value={interactionsCount}
              icon={<UserCircle className="h-5 w-5 text-primary" />}
              data={interactionsData}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="posts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bài đăng trên tường theo thời gian</CardTitle>
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

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bình luận trên tường theo thời gian</CardTitle>
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
