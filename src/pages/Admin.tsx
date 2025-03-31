
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import SidebarNav from '@/components/SidebarNav';
import { User, Users, FileArchive, Activity } from 'lucide-react';
import { UserRole, UploadedFile } from '@/types';
import Dashboard from '@/components/Dashboard';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Mock user data - in a real app would come from database
  const mockMemberUsers = [
    { id: '2', name: 'Member User', email: 'member@example.com', role: UserRole.MEMBER, filesUploaded: 3 },
    { id: '3', name: 'Another Member', email: 'another@example.com', role: UserRole.MEMBER, filesUploaded: 1 },
  ];

  // Callback for getting files from Dashboard
  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const totalFiles = uploadedFiles.length;
  const totalMembers = mockMemberUsers.length;
  const recentActivityCount = totalFiles; // In a real app, this would be actual activity count

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
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files đã tải</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockMemberUsers.map((member) => (
                          <tr key={member.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Thành viên
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">{member.filesUploaded}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên file</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người tải lên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tải lên</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {uploadedFiles.map((file, index) => (
                            <tr key={file.id || index}>
                              <td className="px-6 py-4 whitespace-nowrap">{file.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{file.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{file.uploaderName || 'Unknown'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(file.uploadDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-4">Chưa có files nào được tải lên</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Hidden Dashboard component to get files */}
          <div className="hidden">
            <Dashboard ref={(dashboard) => {
              if (dashboard) {
                // This is a workaround for now - in a real app, 
                // we would use a central state management solution
              }
            }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
