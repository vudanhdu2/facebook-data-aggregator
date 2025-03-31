
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AggregatedUserData } from '@/types';
import { Users, UserCircle, MessageCircle, Share2, ThumbsUp, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsProps {
  aggregatedData: AggregatedUserData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Stats: React.FC<StatsProps> = ({ aggregatedData }) => {
  if (!aggregatedData || aggregatedData.length === 0) {
    return <div className="text-center py-8 text-gray-500">Chưa có dữ liệu để hiển thị thống kê</div>;
  }
  
  // Calculate statistics
  const stats = {
    totalUsers: aggregatedData.length,
    totalFriends: aggregatedData.reduce((sum, user) => sum + user.friendsCount, 0),
    totalGroups: aggregatedData.reduce((sum, user) => sum + user.groupsCount, 0),
    totalPosts: aggregatedData.reduce((sum, user) => sum + user.postsCount, 0),
    totalComments: aggregatedData.reduce((sum, user) => sum + user.commentsCount, 0),
    totalPagesLiked: aggregatedData.reduce((sum, user) => sum + user.pagesLikedCount, 0),
    totalCheckIns: aggregatedData.reduce((sum, user) => sum + user.checkInsCount, 0)
  };
  
  // Prepare data for charts
  const activityDistributionData = [
    { name: 'Bạn bè', value: stats.totalFriends },
    { name: 'Nhóm', value: stats.totalGroups },
    { name: 'Bài đăng', value: stats.totalPosts },
    { name: 'Bình luận', value: stats.totalComments },
    { name: 'Trang đã thích', value: stats.totalPagesLiked },
    { name: 'Địa điểm', value: stats.totalCheckIns }
  ];
  
  // Top users by engagement
  const topUsers = [...aggregatedData]
    .sort((a, b) => {
      const aTotal = a.friendsCount + a.groupsCount + a.postsCount + 
                     a.commentsCount + a.pagesLikedCount + a.checkInsCount;
      const bTotal = b.friendsCount + b.groupsCount + b.postsCount + 
                     b.commentsCount + b.pagesLikedCount + b.checkInsCount;
      return bTotal - aTotal;
    })
    .slice(0, 5)
    .map(user => ({
      name: user.name || user.uid.substring(0, 8),
      friends: user.friendsCount,
      groups: user.groupsCount,
      posts: user.postsCount,
      comments: user.commentsCount,
      pages: user.pagesLikedCount,
      checkIns: user.checkInsCount
    }));
  
  const StatCard = ({ title, value, icon }) => (
    <Card className="stats-card">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          title="Người dùng" 
          value={stats.totalUsers} 
          icon={<Users className="h-4 w-4 text-secondary" />}
        />
        <StatCard 
          title="Bạn bè" 
          value={stats.totalFriends} 
          icon={<UserCircle className="h-4 w-4 text-secondary" />}
        />
        <StatCard 
          title="Bài đăng" 
          value={stats.totalPosts} 
          icon={<Share2 className="h-4 w-4 text-secondary" />}
        />
        <StatCard 
          title="Bình luận" 
          value={stats.totalComments} 
          icon={<MessageCircle className="h-4 w-4 text-secondary" />}
        />
        <StatCard 
          title="Trang đã thích" 
          value={stats.totalPagesLiked} 
          icon={<ThumbsUp className="h-4 w-4 text-secondary" />}
        />
        <StatCard 
          title="Địa điểm đã check-in" 
          value={stats.totalCheckIns} 
          icon={<MapPin className="h-4 w-4 text-secondary" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân phối dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {activityDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top người dùng theo tương tác</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {topUsers.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topUsers}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posts" fill="#8884d8" name="Bài đăng" />
                    <Bar dataKey="comments" fill="#82ca9d" name="Bình luận" />
                    <Bar dataKey="pages" fill="#ffc658" name="Trang đã thích" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Không đủ dữ liệu để hiển thị
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
