
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import UserDetailStats from '@/components/UserDetailStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { AggregatedUserData } from '@/types';

// Helper function to get user data from storage
const getUserFromStorage = (uid: string): AggregatedUserData | null => {
  try {
    const storedData = sessionStorage.getItem('aggregatedUserData');
    if (!storedData) return null;
    
    const userData = JSON.parse(storedData) as AggregatedUserData[];
    return userData.find(user => user.uid === uid) || null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

const UserDetailsPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<AggregatedUserData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    if (!uid) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy UID người dùng",
        variant: "destructive"
      });
      navigate('/users');
      return;
    }

    const user = getUserFromStorage(uid);
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy dữ liệu người dùng",
        variant: "destructive"
      });
      navigate('/users');
      return;
    }

    setUserData(user);
    // Set page title to include user name or UID
    document.title = `Chi tiết: ${user.name || user.uid}`;
  }, [uid, navigate, toast]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Đang tải dữ liệu...</h2>
          <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  const formatSources = (sources: any[]) => {
    return (
      <div className="space-y-1">
        {sources.map((source, index) => (
          <div key={index} className="text-xs">
            <span className="font-medium">{source.sourceType}</span>
            <span className="text-gray-500 ml-1 text-xs">
              ({source.fileType}, {formatDate(source.timestamp)})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleGoBack} 
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          
          <h1 className="text-3xl font-bold">
            Chi tiết người dùng: {userData.name || userData.uid}
          </h1>
          <p className="text-gray-500 mt-1">
            UID: {userData.uid}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="visualization">Biểu đồ trực quan</TabsTrigger>
            <TabsTrigger value="details">Dữ liệu chi tiết</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">UID</p>
                        <p className="text-base">{userData.uid}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tên</p>
                        <p className="text-base">{userData.name || 'Chưa có tên'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bạn bè</p>
                        <p className="text-base">{userData.friendsCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nhóm đã tham gia</p>
                        <p className="text-base">{userData.groupsCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bài đăng</p>
                        <p className="text-base">{userData.postsCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bình luận</p>
                        <p className="text-base">{userData.commentsCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pages đã thích</p>
                        <p className="text-base">{userData.pagesLikedCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Check-ins</p>
                        <p className="text-base">{userData.checkInsCount}</p>
                      </div>
                      {userData.lastActive && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Hoạt động cuối</p>
                          <p className="text-base">{formatDate(userData.lastActive)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle>Nguồn dữ liệu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formatSources(userData.sources)}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tóm tắt hoạt động</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Bài đăng trên tường</p>
                        <p className="text-2xl font-bold">{userData.data.posts?.filter(post => post.post_type === 'wall').length || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Bình luận trên tường</p>
                        <p className="text-2xl font-bold">{userData.data.comments?.filter(comment => comment.comment_type === 'wall').length || 0}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Bài đăng trên nhóm</p>
                        <p className="text-2xl font-bold">{userData.data.posts?.filter(post => post.post_type === 'group').length || 0}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Bình luận trên nhóm</p>
                        <p className="text-2xl font-bold">{userData.data.comments?.filter(comment => comment.comment_type === 'group').length || 0}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Bình luận trên page</p>
                        <p className="text-2xl font-bold">{userData.data.comments?.filter(comment => comment.comment_type === 'page').length || 0}</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Pages đã thích</p>
                        <p className="text-2xl font-bold">{userData.data.pagesLiked?.length || 0}</p>
                      </div>
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Check-ins</p>
                        <p className="text-2xl font-bold">{userData.data.checkIns?.length || 0}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Events tham gia</p>
                        <p className="text-2xl font-bold">{userData.data.events?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <UserDetailStats userData={userData} />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nhóm đã tham gia ({userData.data.groups.length})</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-auto">
                  <div className="space-y-2">
                    {userData.data.groups.length > 0 ? (
                      userData.data.groups.map((group, index) => (
                        <div key={index} className="p-2 border rounded">
                          <p className="font-medium">{group.name || 'Không có tên'}</p>
                          <p className="text-sm text-gray-500">ID: {group.group_id || group.id}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Không có dữ liệu</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pages đã thích ({userData.data.pagesLiked.length})</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-auto">
                  <div className="space-y-2">
                    {userData.data.pagesLiked.length > 0 ? (
                      userData.data.pagesLiked.map((page, index) => (
                        <div key={index} className="p-2 border rounded">
                          <p className="font-medium">{page.name || 'Không có tên'}</p>
                          <p className="text-sm text-gray-500">
                            {page.category && `Danh mục: ${page.category}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Không có dữ liệu</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Check-ins ({userData.data.checkIns.length})</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-auto">
                  <div className="space-y-2">
                    {userData.data.checkIns.length > 0 ? (
                      userData.data.checkIns.map((checkIn, index) => (
                        <div key={index} className="p-2 border rounded">
                          <p className="font-medium">{checkIn.place_name || 'Không có tên'}</p>
                          <p className="text-sm text-gray-500">
                            {checkIn.checkin_time && `Thời gian: ${formatDate(new Date(checkIn.checkin_time))}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Không có dữ liệu</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sự kiện ({userData.data.events.length})</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-auto">
                  <div className="space-y-2">
                    {userData.data.events.length > 0 ? (
                      userData.data.events.map((event, index) => (
                        <div key={index} className="p-2 border rounded">
                          <p className="font-medium">{event.name || 'Không có tên'}</p>
                          <p className="text-sm text-gray-500">
                            {event.start_time && `Bắt đầu: ${formatDate(new Date(event.start_time))}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Không có dữ liệu</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDetailsPage;
