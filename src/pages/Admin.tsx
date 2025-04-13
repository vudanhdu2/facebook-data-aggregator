import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import SidebarNav from "@/components/SidebarNav";
import { User, Users, FileArchive, Activity, PlusCircle } from "lucide-react";
import { UserRole, UploadedFile } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@radix-ui/themes";
import { Dialog } from "@radix-ui/themes";
import { UserParam } from "@/models/user/UserParam";
import { addNewUser, getAllUsers, updateUserInfo } from "@/services/apis";
import { useToast } from '@/components/ui/use-toast';
import { consoleLogUtil } from "@/utils/consoleLogUtil";
import { UserData } from "@/models/user/UserData";
import UserFormModal from "@/components/UserFormModal";

interface AdminDashboardProps {
    uploadedFiles?: UploadedFile[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    uploadedFiles = [],
}) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataUser, setDataUser] = useState<UserData[]>(null);
    const [totalMembers, setTotalMembers] = useState(0);
    const [selectedUser, setSelectedUser] = useState<UserData>(null);
    const { toast } = useToast();
    

    const totalFiles = uploadedFiles.length;
    const recentActivityCount = totalFiles;

    const userColumns = [
        { key: "fullname", header: "Tên", filterable: true },
        { key: "username", header: "Username", filterable: true },
        {
            key: "role",
            header: "Vai trò",
            filterable: true,
            filterOptions: ["admin", "member"],
            render: (value: UserRole) => (
                <Badge
                    variant={value === UserRole.ADMIN ? "default" : "secondary"}
                >
                    {value === UserRole.ADMIN ? "Quản trị viên" : "Thành viên"}
                </Badge>
            ),
        },
        { key: "filesUploaded", header: "Files đã tải", filterable: true },
        { key: "lastActive", header: "Hoạt động cuối", filterable: true },
    ];

    const fileColumns = [
        { key: "name", header: "Tên file", filterable: true },
        {
            key: "type",
            header: "Loại",
            filterable: true,
            filterOptions: ["application/json", "text/csv", "application/zip"],
        },
        { key: "uploaderName", header: "Người tải lên", filterable: true },
        {
            key: "uploadDate",
            header: "Ngày tải lên",
            filterable: true,
            render: (value: Date) => new Date(value).toLocaleDateString(),
        },
        {
            key: "size",
            header: "Kích thước",
            filterable: true,
            render: (value: number) => `${(value / 1024).toFixed(2)} KB`,
        },
    ];

    const callAPIAddUser = async (userData: any) => {
        const params: UserParam = {
            username: userData.username,
            fullname: userData.fullname,
            password: userData.password,
            role: userData.role,
        };
        const res = await addNewUser(params);
        if (res && res.success) {
            setIsDialogOpen(false);
            toast({
                title: "Thêm người dùng thành công",
                description: `Người dùng ${userData.username} đã được thêm thành công.`,
            });
        }
        if (res && !res.success) {
            toast({
                title: "Thêm người dùng thất bại",
                description: res.message,
                variant: "destructive",
            });
        }
    }

    const callAPIUpdateUser = async (userData: any) => {
        const params: any = {
            id: selectedUser.id,
            username: userData.username,
            fullname: userData.fullname,
            password: userData.password,
            role: userData.role,
        };
        const res = await updateUserInfo(params);
        if (res && res.success) {
            setIsDialogOpen(false);
            toast({
                title: "Cập nhật người dùng thành công",
                description: `Người dùng ${userData.username} đã được cập nhật thành công.`,
            });
        }
        if (res && !res.success) {
            toast({
                title: "Cập nhật người dùng thất bại",
                description: res.message,
                variant: "destructive",
            });
        }
    }

    const handleSubmit = async (userData: any) => {
        setIsLoading(true);
        if (selectedUser) {
            // Update existing user
            consoleLogUtil("Update user", selectedUser);
            await callAPIUpdateUser(userData);
        } else {
            // Add new user
            await callAPIAddUser(userData);
        }
        setIsLoading(false);
    }

    const getDataUsers = async () => {
        setIsLoading(true);
        const param: any = {
            page: 1,
            limit: 10,
            keyword: "",
        }
        const res = await getAllUsers(param);
        setIsLoading(false);
        consoleLogUtil("getAllUsers", res.data.users);
        if (res && res.success) {
            setDataUser([...res.data.users ?? []]);
            setTotalMembers(res.data.pagination.totalItems);
        }
        if (res && !res.success) {
            toast({
                title: "Lỗi",
                description: res.message,
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        getDataUsers();
    }
    , []);

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
                                <p className="text-sm text-gray-500">
                                    Tổng thành viên
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {totalMembers}
                                </h3>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <FileArchive className="h-8 w-8 text-green-500 mb-2" />
                                <p className="text-sm text-gray-500">
                                    Tổng files
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {totalFiles}
                                </h3>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <Activity className="h-8 w-8 text-amber-500 mb-2" />
                                <p className="text-sm text-gray-500">
                                    Hoạt động gần đây
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {recentActivityCount}
                                </h3>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <User className="h-8 w-8 text-purple-500 mb-2" />
                                <p className="text-sm text-gray-500">
                                    Quản trị viên
                                </p>
                                <h3 className="text-2xl font-bold">1</h3>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-4"
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">
                                Tổng quan
                            </TabsTrigger>
                            <TabsTrigger value="users">Người dùng</TabsTrigger>
                            <TabsTrigger value="files">
                                Quản lý files
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tổng quan hệ thống</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Chào mừng {user?.fullname ?? ""}!</p>
                                    <p className="text-gray-500 mt-2">
                                        Hệ thống hiện có {totalMembers} thành
                                        viên và {totalFiles} files. Có{" "}
                                        {recentActivityCount} hoạt động gần đây.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="users" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Quản lý người dùng
                                        <Dialog.Root
                                            open={isDialogOpen}
                                            onOpenChange={setIsDialogOpen}
                                        >
                                            <Button
                                                variant="outline"
                                                className="ml-auto"
                                                onClick={() => {
                                                    setIsDialogOpen(true)
                                                    setSelectedUser(null)
                                                }}
                                            >
                                                <PlusCircle className="mr-2" />
                                                Thêm người dùng
                                            </Button>

                                            <UserFormModal onSubmit={handleSubmit} initialData={selectedUser}/>
                                        </Dialog.Root>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DataTable
                                        data={dataUser ?? []}
                                        columns={userColumns}
                                        filterableColumns={[
                                            "name",
                                            "email",
                                            "role",
                                            "filesUploaded",
                                            "lastActive",
                                        ]}
                                        onRowClick={(row: UserData) => {
                                            setSelectedUser(row)
                                            setIsDialogOpen(true)
                                        }}
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
                                            filterableColumns={[
                                                "name",
                                                "type",
                                                "uploaderName",
                                                "uploadDate",
                                                "size",
                                            ]}
                                        />
                                    ) : (
                                        <p className="text-center py-4">
                                            Chưa có files nào được tải lên
                                        </p>
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
