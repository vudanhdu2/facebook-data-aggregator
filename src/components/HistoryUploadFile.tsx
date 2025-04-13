import React, { useEffect, useState } from "react";
import { DataTable } from "./ui/data-table";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AggregatedUserData, UploadedFile } from "@/types";
import {
    Database,
    Upload,
    History,
    Users,
    FileText,
    Eye,
    Brain,
    User,
    Folder,
    X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DataDialog from "./DataDialog";
import AIAnalysis from "./AIAnalysis";
import { getDetailDataFileById, getHistoryUploadByUser } from "@/services/apis";
import { useAuth } from "@/contexts/AuthContext";
import { HistoryResponse } from "@/models/history/HistoryResponse";
import { FileDetail } from "@/models/history/FileDetail";

const HistoryUploadFile: React.FC = () => {
    const [userFiles, setUserFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDataDialogOpen, setIsDataDialogOpen] = useState<boolean>(false);
    const [selectedFileName, setSelectedFileName] = useState<string>("");
    const [selectedFileData, setSelectedFileData] = useState<any[] | null>(
        null
    );
    const [isAIDialogOpen, setIsAIDialogOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<AggregatedUserData | null>(null);
    const [aggregatedData, setAggregatedData] = useState<AggregatedUserData[]>([]);
    const { toast } = useToast();
    const { user } = useAuth();
    const historyColumns = [
        { key: "name", header: "Tên file", filterable: true },
        { key: "type", header: "Loại dữ liệu", filterable: true },
        { key: "uploaderName", header: "Người tải lên", filterable: true },
        { key: "rowCount", header: "Số lượng dòng", filterable: true },
        {
            key: "uploadDate",
            header: "Ngày giờ tải lên",
            filterable: true,
            render: (value: Date) => formatDate(value),
        },
        {
            key: "size",
            header: "Kích thước",
            filterable: true,
            render: (value: number, row: any) =>
                row.size ? `${(row.size / 1024).toFixed(2)} KB` : "N/A",
        },
        {
            key: "actions",
            header: "Xem dữ liệu",
            render: (_: any, row: HistoryResponse) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-primary"
                    onClick={() => handleViewData(row)}
                >
                    <Eye className="h-4 w-4" />
                    <span>Xem</span>
                </Button>
            ),
        },
    ];
    const handleViewData = (file: HistoryResponse) => {
        console.log("file", file);
        getDataByClickRow(file);
    };

    const getDataHistory = async () => {
        setLoading(true);
        try {
            const payload = {
                user_id: user.id,
                page: 1,
                limit: 200,
                keyword: "",
            }
            const res = await getHistoryUploadByUser(payload);
            console.log("res", res);
            if (res.success) {
                const data = res.data.map((item: HistoryResponse) => ({
                    ...item,
                    id: item.id,
                    name: item.file_name,
                    type: item.file_type_name,
                    rowCount: item.row_count,
                    uploadDate: item.fullname,
                    uploaderName: item.fullname,
                    size: item.file_size,

                }));
                setUserFiles([...data]);
            }
            if (res.error) {
                toast({
                    title: "Lỗi",
                    description: res.error,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi tải dữ liệu.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getDataByClickRow = async (file: HistoryResponse) => {
        setLoading(true);
        try {
            const payload = {
                page: 1,
                limit: 10000,
                file_id: file.id,
                data_type_id: file.data_type_id,
                user_id: user.id,
            }
            const res = await getDetailDataFileById(payload);
            console.log("res", res);
            setIsDataDialogOpen(true);
            if (res.success) {
                const data = res.data.data.map((item: FileDetail) => ({
                    id: item.id,
                    uid: item.uid,
                    name: item.name,
                }));
                setSelectedFileData(data);
            } else {
                setSelectedFileData([]);
            }
            if (res.error) {
                toast({
                    title: "Lỗi",
                    description: res.error,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi tải dữ liệu.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDataHistory();
    }
    , []);
    return (
        <div>
            <DataTable
                data={userFiles}
                columns={historyColumns}
                filterableColumns={[
                    "name",
                    "type",
                    "uploaderName",
                    "rowCount",
                    "uploadDate",
                ]}
            />
            <DataDialog
                isOpen={isDataDialogOpen}
                onClose={() => setIsDataDialogOpen(false)}
                title={`Dữ liệu file: ${selectedFileName}`}
                description="Chi tiết dữ liệu trong file đã tải lên"
                data={selectedFileData || []}
            />

            <DataDialog
                isOpen={isAIDialogOpen}
                onClose={() => setIsAIDialogOpen(false)}
                title={`Phân tích AI: ${selectedUser?.name || "Người dùng"}`}
                description="Phân tích dữ liệu người dùng bằng AI"
                wide={true}
            >
                {selectedUser && (
                    <AIAnalysis
                        userData={selectedUser}
                        allUserData={aggregatedData}
                    />
                )}
            </DataDialog>
        </div>
    );
};
export default HistoryUploadFile;
