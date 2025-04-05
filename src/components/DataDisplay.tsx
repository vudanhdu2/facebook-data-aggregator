import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { AggregatedUserData, DataSourceType, UIDSource } from '@/types';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Eye, ArrowLeft, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import UserDetailStats from './UserDetailStats';

interface DataDisplayProps {
  aggregatedData: AggregatedUserData[];
  additionalColumns?: any[];
  onAIAnalysis?: (userData: AggregatedUserData) => void;
  onUserSelect?: (userData: AggregatedUserData) => void;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ 
  aggregatedData, 
  additionalColumns = [],
  onAIAnalysis,
  onUserSelect 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AggregatedUserData | null>(null);

  useEffect(() => {
    if (aggregatedData && aggregatedData.length > 0) {
      sessionStorage.setItem('aggregatedUserData', JSON.stringify(aggregatedData));
    }
  }, [aggregatedData]);

  if (!aggregatedData || aggregatedData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu người dùng. Vui lòng tải lên dữ liệu.
        </div>
      </div>
    );
  }

  const tableData = aggregatedData.map(user => {
    const sourceTypes = user.sources.map(source => source.sourceType);
    const hasProfile = sourceTypes.includes(DataSourceType.UID_PROFILE);
    const hasGroup = sourceTypes.includes(DataSourceType.GROUP);
    const hasPage = sourceTypes.includes(DataSourceType.PAGE);

    return {
      id: user.uid,
      uid: user.uid,
      name: user.name || 'Chưa có tên',
      friendsCount: user.friendsCount,
      groupsCount: user.groupsCount,
      postsCount: user.postsCount,
      commentsCount: user.commentsCount,
      pagesLikedCount: user.pagesLikedCount,
      checkInsCount: user.checkInsCount,
      lastActive: user.lastActive ? formatDate(user.lastActive) : 'N/A',
      sourceTypes: [
        hasProfile ? 'UID Profile' : null,
        hasGroup ? 'Group' : null,
        hasPage ? 'Page' : null
      ].filter(Boolean).join(', '),
      userData: user
    };
  });

  const formatSources = (sources: UIDSource[]) => {
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

  const handleViewDetails = (userData: AggregatedUserData) => {
    setSelectedUser(userData);
    if (onUserSelect) {
      onUserSelect(userData);
    }
  };

  const handleGoToUserPage = (userData: AggregatedUserData) => {
    toast({
      title: "Đang chuyển hướng",
      description: `Đến trang chi tiết của ${userData.name || userData.uid}`,
    });
    
    navigate(`/${userData.uid}`);
  };

  const handleUIDClick = (uid: string) => {
    toast({
      title: "Đang chuyển hướng",
      description: `Đến trang chi tiết của UID: ${uid}`,
    });
    navigate(`/${uid}`);
  };

  const userColumns = [
    { 
      key: 'name', 
      header: 'Tên', 
      filterable: true 
    },
    { 
      key: 'uid', 
      header: 'UID', 
      filterable: true,
      render: (value: string) => (
        <button 
          onClick={() => handleUIDClick(value)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {value}
        </button>
      )
    },
    { key: 'friendsCount', header: 'Bạn bè', filterable: true },
    { key: 'groupsCount', header: 'Nhóm', filterable: true },
    { key: 'postsCount', header: 'Bài đăng', filterable: true },
    { key: 'commentsCount', header: 'Bình luận', filterable: true },
    { key: 'pagesLikedCount', header: 'Pages Liked', filterable: true },
    { key: 'checkInsCount', header: 'Check-ins', filterable: true },
    { key: 'lastActive', header: 'Hoạt động cuối', filterable: true },
    { key: 'sourceTypes', header: 'Loại nguồn', filterable: true },
    { 
      key: 'viewDetails', 
      header: 'Chi tiết', 
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-primary"
            onClick={() => handleViewDetails(row.userData)}
          >
            <Eye className="h-4 w-4" />
            <span>Xem</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleGoToUserPage(row.userData)}
          >
            <ExternalLink className="h-4 w-4" />
            <span>Trang chi tiết</span>
          </Button>
        </div>
      )
    },
    ...additionalColumns
  ];

  if (selectedUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Chi tiết người dùng: {selectedUser.name || selectedUser.uid}</h2>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleGoToUserPage(selectedUser)} 
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Xem trang chi tiết
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSelectedUser(null)} 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </Button>
          </div>
        </div>
        
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
                    <p className="text-base">{selectedUser.uid}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tên</p>
                    <p className="text-base">{selectedUser.name || 'Chưa có tên'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bạn bè</p>
                    <p className="text-base">{selectedUser.friendsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nhóm đã tham gia</p>
                    <p className="text-base">{selectedUser.groupsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bài đăng</p>
                    <p className="text-base">{selectedUser.postsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bình luận</p>
                    <p className="text-base">{selectedUser.commentsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pages đã thích</p>
                    <p className="text-base">{selectedUser.pagesLikedCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-ins</p>
                    <p className="text-base">{selectedUser.checkInsCount}</p>
                  </div>
                  {selectedUser.lastActive && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hoạt động cuối</p>
                      <p className="text-base">{formatDate(selectedUser.lastActive)}</p>
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
                {formatSources(selectedUser.sources)}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <UserDetailStats userData={selectedUser} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dữ liệu người dùng</CardTitle>
          <CardDescription>
            Tổng cộng {aggregatedData.length} người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={tableData}
            columns={userColumns}
            filterableColumns={['name', 'uid', 'friendsCount', 'groupsCount', 'postsCount', 'commentsCount', 'sourceTypes']}
            expandableContent={(row) => (
              <div className="py-4">
                <h4 className="font-medium mb-2">Nguồn dữ liệu</h4>
                {formatSources(row.userData.sources)}
              </div>
            )}
            onRowClick={(row) => setExpandedRowId(expandedRowId === row.id ? null : row.id)}
            expandedRowId={expandedRowId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DataDisplay;
