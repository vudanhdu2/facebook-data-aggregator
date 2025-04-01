import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import SidebarNav from '@/components/SidebarNav';
import { User, Users, FileArchive, Activity } from 'lucide-react';
import { UserRole, UploadedFile } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface AdminDashboardProps {
  uploadedFiles?: UploadedFile[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ uploadedFiles = [] }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data - in a real app would come from database
  const mockMemberUsers = [
    { id: '2', name: 'Member User', email: 'member@example.com', role: UserRole.MEMBER, filesUploaded: 3, lastActive: '2023-12-01' },
    { id: '3', name: 'Another Member', email: 'another@example.com', role: UserRole.MEMBER, filesUploaded: 1, lastActive: '2023-11-15' },
    { id: '4', name: 'New User', email: 'new@example.com', role: UserRole.MEMBER, filesUploaded: 0, lastActive: '2023-12-10' },
  ];

  const totalFiles = uploadedFiles.length;
  const totalMembers = mockMemberUsers.length;
  const recentActivityCount = totalFiles; // In a real app, this would be actual activity count

  // Table column definitions with enhanced filter options
  const userColumns = [
    { key: 'name', header: 'Tên', filterable: true },
    { key: 'email', header: 'Email', filterable: true },
    { 
      key: 'role', 
      header: 'Vai trò', 
      filterable: true,
      filterOptions: ['ADMIN', 'MEMBER'],
      render: (value: UserRole) => (
        <Badge variant={value === UserRole.ADMIN ? "default" : "secondary"}>
          {value === UserRole.ADMIN ? 'Quản trị viên' : 'Thành viên'}
        </Badge>
      )
    },
    { key: 'filesUploaded', header: 'Files đã tải', filterable: true },
    { key: 'lastActive', header: 'Hoạt động cuối', filterable: true },
  ];

  const fileColumns = [
    { key: 'name', header: 'Tên file', filterable: true },
    { key: 'type', header: 'Loại', filterable: true, filterOptions: ['application/json', 'text/csv', 'application/zip'] },
    { key: 'uploaderName', header: 'Người tải lên', filterable: true },
    { 
      key: 'uploadDate', 
      header: 'Ngày tải lên', 
      filterable: true,
      render: (value: Date) => new Date(value).toLocaleDateString()
    },
    { key: 'size', header: 'Kích thước', filterable: true, render: (value: number) => `${(value / 1024).toFixed(2)} KB` }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-white shadow-sm hidden md:block">
          <SidebarNav />
        </aside>
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Trang quản trị</h1>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm text-gray-500">Tổng thành viên</p>
                <h3 className="text-2xl font-bold">{totalMembers}</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileArchive className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm text-gray-500">Tổng files</p>
                <h3 className="text-2xl font-bold">{totalFiles}</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Activity className="h-8 w-8 text-amber-500 mb-2" />
                <p className="text-sm text-gray-500">Hoạt động gần đây</p>
                <h3 className="text-2xl font-bold">{recentActivityCount}</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <User className="h-8 w-8 text-purple-500 mb-2" />
                <p className="text-sm text-gray-500">Quản trị viên</p>
                <h3 className="text-2xl font-bold">1</h3>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="users">Người dùng</TabsTrigger>
              <TabsTrigger value="files">Quản lý files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tổng quan hệ thống</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Chào mừng quản trị viên {user?.name || user?.email}!</p>
                  <p className="text-gray-500 mt-2">
                    Hệ thống hiện có {totalMembers} thành viên và {totalFiles} files.
                    Có {recentActivityCount} hoạt động gần đây.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý người dùng</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    data={mockMemberUsers} 
                    columns={userColumns}
                    filterableColumns={['name', 'email', 'role', 'filesUploaded', 'lastActive']}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý files</CardTitle>
                </CardHeader>
                <CardContent>
                  {uploadedFiles.length > 0 ? (
                    <DataTable 
                      data={uploadedFiles} 
                      columns={fileColumns}
                      filterableColumns={['name', 'type', 'uploaderName', 'uploadDate', 'size']}
                    />
                  ) : (
                    <p className="text-center py-4">Chưa có files nào được tải lên</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
