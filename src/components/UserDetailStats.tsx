
import React from 'react';
import { AggregatedUserData } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileBarChart, MessageSquare, Users, ThumbsUp, Calendar, MapPin } from 'lucide-react';

interface UserDetailStatsProps {
  userData: AggregatedUserData | null;
}

// This component is for visualizing user data in charts
const UserDetailStats: React.FC<UserDetailStatsProps> = ({ userData }) => {
  if (!userData) return null;

  // Mock data for visualization - in a real app would come from actual user data
  const postTimelineData = [
    { month: 'Jan', wallPosts: 5, groupPosts: 3 },
    { month: 'Feb', wallPosts: 7, groupPosts: 8 },
    { month: 'Mar', wallPosts: 10, groupPosts: 6 },
    { month: 'Apr', wallPosts: 8, groupPosts: 9 },
    { month: 'May', wallPosts: 12, groupPosts: 11 },
    { month: 'Jun', wallPosts: 6, groupPosts: 7 },
  ];

  const commentTimelineData = [
    { month: 'Jan', wallComments: 15, groupComments: 8, pageComments: 3 },
    { month: 'Feb', wallComments: 12, groupComments: 10, pageComments: 5 },
    { month: 'Mar', wallComments: 18, groupComments: 12, pageComments: 7 },
    { month: 'Apr', wallComments: 10, groupComments: 15, pageComments: 9 },
    { month: 'May', wallComments: 22, groupComments: 18, pageComments: 12 },
    { month: 'Jun', wallComments: 16, groupComments: 14, pageComments: 8 },
  ];

  // Extended user stats (for demonstration, in real app would be calculated from data)
  const extendedStats = {
    wallPostCount: userData.postsCount || 0,
    wallCommentCount: userData.commentsCount || 0,
    groupPostCount: Math.floor(userData.postsCount * 0.6) || 0,
    groupCommentCount: Math.floor(userData.commentsCount * 0.7) || 0,
    pageCommentCount: Math.floor(userData.commentsCount * 0.3) || 0,
    pageLikeCount: userData.pagesLikedCount || 0,
    checkInCount: userData.checkInsCount || 0,
    eventCount: Math.floor(Math.random() * 15), // Mock data
    interactionCount: Math.floor((userData.postsCount + userData.commentsCount) * 2.5), // Mock engagement data
  };

  return (
    <div className="space-y-6">
      {/* User Profile Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Thông tin chi tiết UID: {userData.uid}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Thuộc tính</TableHead>
                  <TableHead>Giá trị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">UID</TableCell>
                  <TableCell>{userData.uid}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tên</TableCell>
                  <TableCell>{userData.name || 'Không có'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hoạt động cuối</TableCell>
                  <TableCell>{userData.lastActive ? userData.lastActive.toLocaleDateString() : 'Không xác định'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Số nguồn dữ liệu</TableCell>
                  <TableCell>{userData.sources.length}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div>
        <h3 className="text-lg font-medium mb-4">Thống kê hoạt động</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <FileBarChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số bài đăng trên tường</p>
                <h4 className="text-2xl font-bold">{extendedStats.wallPostCount}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số cmt trên tường</p>
                <h4 className="text-2xl font-bold">{extendedStats.wallCommentCount}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số bài đăng trên nhóm</p>
                <h4 className="text-2xl font-bold">{extendedStats.groupPostCount}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số cmt trên nhóm</p>
                <h4 className="text-2xl font-bold">{extendedStats.groupCommentCount}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số cmt trên page</p>
                <h4 className="text-2xl font-bold">{extendedStats.pageCommentCount}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <ThumbsUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số page đã like</p>
                <h4 className="text-2xl font-bold">{extendedStats.pageLikeCount}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số page đã check in</p>
                <h4 className="text-2xl font-bold">{extendedStats.checkInCount}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số event tham gia</p>
                <h4 className="text-2xl font-bold">{extendedStats.eventCount}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số nhóm đã tham gia</p>
                <h4 className="text-2xl font-bold">{userData.groupsCount}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-primary/10 p-2 mr-4">
                <ThumbsUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tương tác (like, cmt, share)</p>
                <h4 className="text-2xl font-bold">{extendedStats.interactionCount}</h4>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visualizations */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Trực quan hóa dữ liệu</h3>
        
        <Card>
          <CardHeader>
            <CardTitle>Số bài đăng theo thời gian</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={postTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="wallPosts" 
                  name="Bài đăng trên tường" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="groupPosts" 
                  name="Bài đăng trên nhóm" 
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Số bình luận theo thời gian</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commentTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="wallComments" 
                  name="Bình luận trên tường" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="groupComments" 
                  name="Bình luận trên nhóm" 
                  stroke="#82ca9d" 
                />
                <Line 
                  type="monotone" 
                  dataKey="pageComments" 
                  name="Bình luận trên page" 
                  stroke="#ffc658" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailStats;
