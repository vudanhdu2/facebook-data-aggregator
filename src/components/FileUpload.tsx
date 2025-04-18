import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle, Calendar, UserCircle, FileText, Users, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadedFile, FacebookDataType, FILE_TYPE_OPTIONS, DataSourceType, DATA_SOURCE_OPTIONS, MODE_API_IMPORT, TYPE_API_IMPORT } from '@/types';
import { formatUID, readExcelFile } from '@/utils/dataParser';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { createDemoData } from '@/utils/demoData';
import { v4 as uuidv4 } from 'uuid';
import { FileTypeImport } from '@/models/import/FileTypeImport';
import { AccountType } from '@/models/import/AccountType';
import { getAllAccountType, getAllFileTypeImport, importFileEntities, importFileGroupEntities, importFileGeneralEntities, importFileComments, importFilePosts, importFileStats } from '@/services/apis';
import { consoleLogUtil } from '@/utils/consoleLogUtil';
import { AlertDialog, Flex } from "@radix-ui/themes"
import { convertToTimestamp, exportSkippedUidsToExcel, getNumber } from '@/utils/funcHelper';

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<FacebookDataType | null>(null);
  const [selectedSourceType, setSelectedSourceType] = useState<DataSourceType>(DataSourceType.UID_PROFILE);
  const [sourceUID, setSourceUID] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [lstFileType, setLstFileType] = useState<FileTypeImport[]>([]);
  const [lstAccountType, setLstAccountType] = useState<AccountType[]>([]);
  const [showConfirmNoUID, setShowConfirmNoUID] = useState<boolean>(false);


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const getDataFileType = async () => {
    try {
      const response = await getAllFileTypeImport();
      if (response?.success) {
        setLstFileType([...response.data ?? []]);
      } else {
        setLstFileType([]);
      }
    } catch (error) {
      console.error("Error fetching file types:", error);
    }
  }

  const getDataAccountType = async () => {
    try {
      const response = await getAllAccountType();
      if (response?.success) {
        setLstAccountType([...response.data ?? []]);
      } else {
        setLstAccountType([]);
      }
    } catch (error) {
      console.error("Error fetching account types:", error);
    }
  }

  const processFile = async (file: File, manualType?: FacebookDataType) => {
    try {
      const result = await readExcelFile(file);
      if (result) {
        if (manualType) {
          result.type = manualType;
          result.manualType = true;
        }

        result.sourceType = selectedSourceType;
        if (sourceUID.trim()) {
          result.sourceUID = sourceUID.trim();
        }

        if (user) {
          result.uploaderId = user.id;
          result.uploaderName = user.fullname;
        } else {
          result.uploaderId = 0;
          result.uploaderName = "Anonymous User";
        }

        result.id = uuidv4();

        return result;
      }
    } catch (error) {
      console.error("Error processing file:", file.name, error);
      toast({
        title: "Lỗi xử lý file",
        description: `Không thể xử lý file ${file.name}. Vui lòng đảm bảo đây là file Excel hợp lệ.`,
        variant: "destructive"
      });
    }
    return null;
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);

    const newFiles = [e.dataTransfer.files[0]].filter(
      file => file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
    );

    if (newFiles.length === 0) {
      toast({
        title: "Định dạng không hỗ trợ",
        description: "Chỉ có thể tải lên các file Excel (.xls hoặc .xlsx)",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    const processedFiles = await Promise.all(
      newFiles.map(file => processFile(file, selectedFileType || undefined))
    );
    const validFiles = processedFiles.filter(Boolean) as UploadedFile[];

    if (files.length > 0) {
      toast({
        title: "Đã thay thế file cũ",
        description: `File "${files[0].name}" đã bị thay bằng "${validFiles[0].name}".`,
      });
    }
    setFiles(validFiles);
    onFilesUploaded(validFiles);

    setIsProcessing(false);
    toast({
      title: "Tải lên thành công",
      description: `Đã tải lên ${validFiles.length} file dữ liệu Facebook.`
    });
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsProcessing(true);
    const newFiles = [e.target.files[0]].filter(
      file => file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
    );

    if (newFiles.length === 0) {
      toast({
        title: "Định dạng không hỗ trợ",
        description: "Chỉ có thể tải lên các file Excel (.xls hoặc .xlsx)",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }



    const processedFiles = await Promise.all(
      newFiles.map(file => processFile(file, selectedFileType || undefined))
    );
    const validFiles = processedFiles.filter(Boolean) as UploadedFile[];
    if (files.length > 0) {
      toast({
        title: "Đã thay thế file cũ",
        description: `File "${files[0].name}" đã bị thay bằng "${validFiles[0].name}".`,
      });
    }
    setFiles(validFiles);
    onFilesUploaded(validFiles);
    setIsProcessing(false);
    e.target.value = '';

    toast({
      title: "Tải lên thành công",
      description: `Đã tải lên ${validFiles.length} file dữ liệu Facebook.`
    });
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  const updateFileType = (fileIndex: number, newType: FacebookDataType) => {
    const updatedFiles = [...files];
    updatedFiles[fileIndex] = {
      ...updatedFiles[fileIndex],
      type: newType,
      manualType: true
    };

    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);

    toast({
      title: "Đã cập nhật loại dữ liệu",
      description: `File "${files[fileIndex].name}" đã được cập nhật thành ${getFacebookDataTypeLabel(newType)}`
    });
  };

  const updateSourceType = (fileIndex: number, newSourceType: DataSourceType) => {
    const updatedFiles = [...files];
    updatedFiles[fileIndex] = {
      ...updatedFiles[fileIndex],
      sourceType: newSourceType
    };

    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);

    toast({
      title: "Đã cập nhật nguồn dữ liệu",
      description: `File "${files[fileIndex].name}" đã được cập nhật thành ${getDataSourceTypeLabel(newSourceType)}`
    });
  };

  const updateSourceUID = (fileIndex: number, newUID: string) => {
    const updatedFiles = [...files];
    updatedFiles[fileIndex] = {
      ...updatedFiles[fileIndex],
      sourceUID: newUID.trim() || undefined
    };

    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);

    toast({
      title: "Đã cập nhật UID nguồn",
      description: `File "${files[fileIndex].name}" đã được cập nhật với UID: ${newUID || 'Không có'}`
    });
  };

  const handleUploadFile = () => {
    console.log("Upload file clicked ", selectedSourceType);

    if (!selectedFileType) {
      toast({
        title: "Chưa chọn loại dữ liệu",
        description: "Vui lòng chọn loại dữ liệu trước khi tải lên.",
        variant: "destructive"
      });
      return;
    }
    if (files.length === 0) {
      toast({
        title: "Chưa có file nào được tải lên",
        description: "Vui lòng tải lên ít nhất một file trước khi lưu.",
        variant: "destructive"
      });
      return;
    }
    if (!selectedSourceType) {
      toast({
        title: "Chưa nhập loại tài khoản",
        description: "Vui lòng nhập loại tài khoản trước khi tải lên.",
        variant: "destructive"
      });
      return;
    }
    if (isProcessing) {
      toast({
        title: "Đang xử lý",
        description: "Vui lòng đợi cho đến khi quá trình tải lên hoàn tất.",
        variant: "destructive"
      });
      return;
    }

    switch (selectedFileType) {
      // Mục tìm UID bạn bè
      case FacebookDataType.FRIENDS: // Tìm uid bạn bè
      case FacebookDataType.NEW_FRIENDS: // Bạn bè mới thêm
      case FacebookDataType.REQUEST_FRIENDS: // UID đã gửi yêu cầu kết bạn
      case FacebookDataType.FOLLOWING: // TÌm UId following
      case FacebookDataType.FOLLOWERS: // TÌm uid followers
      // Mục tìm UID thành viên nhóm
      case FacebookDataType.GROUP_MEMBERS: // Tìm thành viên nhóm
      case FacebookDataType.GROUP_COMMON_INTERESTS: // Tìm thành viên nhóm có điểm chung
      case FacebookDataType.GROUP_MEMBER_FRIENDS: // Tìm bạn bè trong nhóm
      case FacebookDataType.GROUP_NEARBY_MEMBERS: // Tìm uid thành viên gần
      case FacebookDataType.GROUP_MUTUAL_FRIENDS: // Tìm uid thành viên có bạn chung
      case FacebookDataType.GROUP_FILTERED_MEMBERS: // Tìm uid  nhiều điều kiện
      case FacebookDataType.GROUP_TOP_CONTRIBUTORS: // Tìm uid thành viên đóng góp nhiều
      //Mục tìm ID Profile Group Page
      case FacebookDataType.SEARCH_GROUPS_BY_KEYWORD: // Tìm uid nhóm theo từ khóa
      case FacebookDataType.SEARCH_PAGES_BY_KEYWORD: // Tìm uid page theo từ khóa
      case FacebookDataType.SEARCH_PROFILES_BY_KEYWORD: // Tìm uid profile theo từ khóa
      case FacebookDataType.PAGES_LIKED_BY_UID: // TÌM ID PAGE ĐÃ LIKE CỦA UID
      case FacebookDataType.PAGES_CHECKEDIN_BY_UID: // TÌM ID PAGE ĐÃ CHECKIN CỦA UID
      case FacebookDataType.RELATED_PAGES: // Tìm ID page liên quan
      case FacebookDataType.PAGE_LIKERS: // Tìm UID người đã like page
      case FacebookDataType.PAGE_TOP_FANS: // Tìm UID fan cứng
      // Mục TÌM UID THAM GIA EVENT
      case FacebookDataType.EVENT_ATTENDEES: // Tìm UID tham gia Event
      case FacebookDataType.EVENT_COMMENTERS: // Tìm UID comment Event
      case FacebookDataType.EVENT_INTERESTED: // Tìm UID quan tâm Event
      case FacebookDataType.EVENT_INVITEES: // Tìm UID đã mời tham gia Event
      // TÌM UID ADMIN NHÓM
      case FacebookDataType.GROUP_APPROVERS: // Tìm UID chấp thuận trước
      // TIÌM UID THÀNH VIÊN NHÓM CHÁT
      case FacebookDataType.GROUP_CHAT_MEMBERS: // Tìm UID thành viên nhóm chat
      // TÌM UID VOTE BÀI VIẾT
      case FacebookDataType.POST_VOTERS: // TÌM UID VOTE BÀI VIẾT
      case FacebookDataType.INTERACTION_ON_ENTITY: // TÌM UID LIKE , cmt, share , đc tag trong cmt TRONG ID PAGE , GROUP hoăc Link
      case FacebookDataType.POST_AUTHOR_IDS: // QUÉT ID ĐĂNG BÀI
        handleUploadUIDs(selectedFileType, selectedSourceType, MODE_API_IMPORT.DEFAULT, TYPE_API_IMPORT.ENTITIES);
        break;
      // TÌM UID LIKE CMT SHARE BÀI VIẾT
      case FacebookDataType.INTERACTION_ON_POST: // TÌM UID LIKE , cmt, share , đc tag trong cmt TRONG ID BÀI
        handleUploadUIDs(selectedFileType, selectedSourceType, MODE_API_IMPORT.DEFAULT, TYPE_API_IMPORT.ENTITIES);
        break;
      //TÌM ID EVENT THEO TỪ KHÓA
      case FacebookDataType.SEARCH_EVENTS_BY_KEYWORD: // TÌM ID EVENT THEO TỪ KHÓA
        handleUploadUIDs(selectedFileType, DataSourceType.EVENT, MODE_API_IMPORT.DEFAULT, TYPE_API_IMPORT.ENTITIES);
        break;
      // TÌM ID PLace theo TỪ KHÓA
      case FacebookDataType.SEARCH_PLACES_BY_KEYWORD: // TÌM ID PLace theo TỪ KHÓA
        handleUploadUIDs(selectedFileType, DataSourceType.PLACE, MODE_API_IMPORT.DEFAULT, TYPE_API_IMPORT.ENTITIES);
        break;
      case FacebookDataType.GROUPS_JOINED_BY_UID: // TÌM ID NHÓM ĐÃ THAM GIA CỦA UID
        handleUploadUIDs(selectedFileType, DataSourceType.GROUP, MODE_API_IMPORT.GROUP, TYPE_API_IMPORT.ENTITIES);
        break;

      // Mục Quét nội dung comment
      case FacebookDataType.COMMENT_STATS_ON_LINK: //THỐNG KÊ CMT TRONG LINK BÀI VIẾT
      case FacebookDataType.COMMENTS_ON_PAGE_BY_POST_COUNT: // TÌM COMMENT TRÊN PAGE THEO SỐ BÀI
      case FacebookDataType.COMMENTS_ON_GROUP_BY_POST_COUNT: // TÌM COMMENT TRÊN GR THEO SỐ BÀI
      case FacebookDataType.COMMENTS_ON_PROFILE_BY_POST_COUNT: // TÌM COMMENT TRÊN PROFILE THEO SỐ BÀI
        handleUploadUIDs(selectedFileType, DataSourceType.GROUP, MODE_API_IMPORT.GROUP, TYPE_API_IMPORT.COMMENTS);
        break;

      //TÌM UID ADMIN NHÓM         
      case FacebookDataType.GROUP_ADMINS: // Tìm UID admin nhóm
        debugger
        handleUploadUIDs(selectedFileType, DataSourceType.UID_PROFILE, MODE_API_IMPORT.ADMIN, TYPE_API_IMPORT.ENTITIES);
        break;
      case FacebookDataType.POSTS_BY_PAGE_ID: // QUÉT DANH SÁCH BÀI THEO ID PAGE
      case FacebookDataType.POSTS_BY_GROUP_ID: // QUÉT DANH SÁCH BÀI THEO ID GROUP
      case FacebookDataType.POSTS_BY_PROFILE_ID: // QUÉT DANH SÁCH BÀI THEO ID PROFILE
      case FacebookDataType.POSTS_BY_TAG_ID: // QUÉT DANH SÁCH BÀI THEO ID TAG
        handleUploadUIDs(selectedFileType, DataSourceType.PAGE, MODE_API_IMPORT.DEFAULT, TYPE_API_IMPORT.POSTS);
        break;
      // Mục THỐNG KÊ TƯƠNG TÁC
      case FacebookDataType.GROUP_POST_STATS: // THỐNG KÊ LƯỢT ĐĂNG CỦA GROUP
        handleUploadUIDs(selectedFileType, DataSourceType.PAGE, MODE_API_IMPORT.DEFAULT, TYPE_API_IMPORT.STATS);
        break;
      default:
        break;
    }

  };
  const handleUploadUIDs = async (relation_type: FacebookDataType, type: DataSourceType, mode: MODE_API_IMPORT, type_api: TYPE_API_IMPORT) => {
    const uid = sourceUID.trim();

    if (!uid) {
      setShowConfirmNoUID(true); // Show confirm popup
      return;
    }

    await processUpload(uid, relation_type, type, mode, type_api);

  }

  const processUpload = async (uid: string | null, relation_type: FacebookDataType, type: DataSourceType, mode: MODE_API_IMPORT, type_api: TYPE_API_IMPORT) => {
    setIsProcessing(true);
    let newMode: string;
    switch (relation_type) {
      case FacebookDataType.GROUPS_JOINED_BY_UID: // TÌM ID NHÓM ĐÃ THAM GIA CỦA UID
      case FacebookDataType.COMMENTS_ON_PROFILE_BY_POST_COUNT: // TÌM COMMENT TRÊN PROFILE THEO SỐ BÀI
        newMode = MODE_API_IMPORT.GROUP;
        break;
      case FacebookDataType.GROUP_ADMINS: // Tìm UID admin nhóm
        newMode = MODE_API_IMPORT.ADMIN;
        break;
      default:
        newMode = MODE_API_IMPORT.DEFAULT;
        break;
    }
    const file = files[0];
    consoleLogUtil("File upload", file);
    const uidList = formatUID(file.data, 0);
    const payload = {
      file_name: file.name,
      uid: newMode === MODE_API_IMPORT.ADMIN ? (uid ? uid : (uidList.length > 0 ? uidList[0]?.[2] : null)) : (uid || null),
      user_id: file.uploaderId,
      data_type_id: lstFileType.find(item => item.code === selectedFileType)?.id,
      account_type_id: lstAccountType.find(item => item.code === selectedSourceType)?.id,
      file_size: file.size,
      row_count: file.rowCount,
      relation_type: relation_type,
      type: type,
      uids: uidList,
      mode: newMode,
    };

    console.log(payload);
    switch (type_api) {
      case TYPE_API_IMPORT.ENTITIES:
        callAPIImportEntities(payload);
        break;
      case TYPE_API_IMPORT.COMMENTS:
        callAPIImportComments(payload);
        break;
      case TYPE_API_IMPORT.POSTS:
        callAPIImportPosts(payload);
        break;
      case TYPE_API_IMPORT.STATS:
        callAPIImportStats(payload);
        break;  
      default:
        break;
    }

  };

  const callAPIImportEntities = async (payload: any) => {
    try {
      setIsProcessing(true);
      const res = await importFileGeneralEntities(payload);
      setIsProcessing(false);
      if (res?.success) {
        exportSkippedUidsToExcel(res.data.skipped, 'skipped_uids.xlsx');
        toast({
          title: "Đã tải lên thành công",
          description: `Đã tải ${res.data.inserted.length} dòng, trùng ${res.data.skipped.length} dòng.`,
        });
      } else {
        consoleLogUtil("Error uploading file", payload);
        toast({
          title: "Lỗi tải lên",
          description: res?.message || "Đã xảy ra lỗi khi tải lên file.",
          variant: "destructive",
        });
      }
    } catch (error) {

    } finally {
      setIsProcessing(false);
      setFiles([]);
      onFilesUploaded([]);
    }
  }
  const formatUIDPost = (dataRows: any[][], source_id: string) => {
    if (!dataRows || dataRows.length === 0) return [];
    const parsed = dataRows.map(item => {
      if (/^[^_]+_[^_]+$/.test(item[0])) {
        const author_uid = item[0].split('_')[0];
        return [item[0], item[1]?.trim(), convertToTimestamp(item[5]), '', author_uid, getNumber(item[2]?.trim()), getNumber(item[3]?.trim()), getNumber(item[4]?.trim())];
      }
      return [item[0], item[1]?.trim(), convertToTimestamp(item[5]), '', source_id, getNumber(item[2]?.trim()), getNumber(item[3]?.trim()), getNumber(item[4]?.trim())];; // giữ nguyên nếu không khớp
    });
    return parsed
  }

  const callAPIImportStats = async (payload: any) => {
    const newPayload = {
      ...payload,
      stats: payload.uids
  }
    try {
      setIsProcessing(true);
      const res = await importFileStats(newPayload);
      setIsProcessing(false);
      if (res?.success) {
        exportSkippedUidsToExcel(res.data.skipped_uids, 'skipped_uids.xlsx');
        toast({
          title: "Đã tải lên thành công",
          description: `Đã tải ${res.data.inserted_count} dòng, trùng ${res.data.skipped_count} dòng.`,
        });
      } else {
        consoleLogUtil("Error uploading file", newPayload);
        toast({
          title: "Lỗi tải lên",
          description: res?.message || "Đã xảy ra lỗi khi tải lên file.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading file", error);
    }
}
  const callAPIImportPosts = async (payload: any) => {
    const uidPosts = formatUIDPost(payload.uids, payload.uid);
    consoleLogUtil("Formatted UID Posts", uidPosts);
    const lstUidPostLong = uidPosts.filter(item => item[0] !== undefined && item[0].length > 100).map(item => item[0]);
    const newPayload = {
      file_name: payload.file_name,
      uid: payload.uid,
      user_id: payload.user_id,
      data_type_id: payload.data_type_id,
      account_type_id: payload.account_type_id,
      file_size: payload.file_size,
      posts: uidPosts.filter(item => item[0] !== undefined && item[0].length > 0 && item[0].length < 100 && item[2] !== "0 likes") // bỏ qua các uid post quá dài trên 100 ký tự,
    };
    try {
      setIsProcessing(true);
      const res = await importFilePosts(newPayload);
      setIsProcessing(false);
      if (res?.success) {
        exportSkippedUidsToExcel([...res.data.skipped_uids, ...lstUidPostLong], 'skipped_uids.xlsx');
        toast({
          title: "Đã tải lên thành công",
          description: `Đã tải ${res.data.inserted_count} dòng, trùng ${res.data.skipped_count} dòng.`,
        });
      } else {
        consoleLogUtil("Error uploading file", newPayload);
        toast({
          title: "Lỗi tải lên",
          description: res?.message || "Đã xảy ra lỗi khi tải lên file.",
          variant: "destructive",
        });
      }
    } catch (error) {

    } finally {
      setIsProcessing(false);
      setFiles([]);
      onFilesUploaded([]);
    }
  }
  const callAPIImportComments = async (payload: any) => {
    try {
      setIsProcessing(true);
      const res = await importFileComments(payload);
      setIsProcessing(false);
      if (res?.success) {
        exportSkippedUidsToExcel(res.data.skipped, 'skipped_uids.xlsx');
        toast({
          title: "Đã tải lên thành công",
          description: `Đã tải ${res.data.inserted.length} dòng, trùng ${res.data.skipped.length} dòng.`,
        });
      } else {
        consoleLogUtil("Error uploading file", payload);
        toast({
          title: "Lỗi tải lên",
          description: res?.message || "Đã xảy ra lỗi khi tải lên file.",
          variant: "destructive",
        });
      }
    } catch (error) {

    } finally {
      setIsProcessing(false);
      setFiles([]);
      onFilesUploaded([]);
    }
  }

  const getFacebookDataTypeLabel = (type: FacebookDataType): string => {
    const option = FILE_TYPE_OPTIONS.find(opt => opt.value === type);
    return option ? option.label : 'Không xác định';
  };

  const getDataSourceTypeLabel = (type: DataSourceType): string => {
    const option = DATA_SOURCE_OPTIONS.find(opt => opt.value === type);
    return option ? option.label : 'Hồ sơ người dùng';
  };

  const getSourceTypeIcon = (sourceType: DataSourceType) => {
    switch (sourceType) {
      case DataSourceType.UID_PROFILE:
        return <UserCircle className="h-3 w-3 mr-1" />;
      case DataSourceType.PAGE:
        return <FileText className="h-3 w-3 mr-1" />;
      case DataSourceType.GROUP:
        return <Users className="h-3 w-3 mr-1" />;
      default:
        return <UserCircle className="h-3 w-3 mr-1" />;
    }
  };
  useEffect(() => {
    getDataFileType();
    getDataAccountType();
  }
    , []);
  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                value={selectedFileType || undefined}
                onValueChange={(value) => setSelectedFileType(value as FacebookDataType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại dữ liệu (tùy chọn)" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {lstFileType.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSourceType}
                onValueChange={(value) => setSelectedSourceType(value as DataSourceType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn nguồn dữ liệu" />
                </SelectTrigger>
                <SelectContent>
                  {lstAccountType.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="sm:col-span-2">
                <Input
                  placeholder="Nhập UID nguồn (nếu có)"
                  value={sourceUID}
                  onChange={(e) => setSourceUID(e.target.value)}
                  className="mb-3"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Chọn file
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleUploadFile}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Lưu dữ liệu
                  </Button>
                </div>
              </div>
            </div>
            <AlertDialog.Root open={showConfirmNoUID} onOpenChange={setShowConfirmNoUID}>
              <AlertDialog.Content>
                <AlertDialog.Title>Không nhập UID</AlertDialog.Title>
                <AlertDialog.Description>
                  Bạn chưa nhập UID nguồn. Bạn có chắc chắn muốn tiếp tục tải lên mà không có UID?
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="secondary" color="gray">Hủy</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button
                      variant="default"
                      color="blue"
                      onClick={() => {
                        setShowConfirmNoUID(false)
                        let mode;
                        if (selectedSourceType === DataSourceType.GROUP) {
                          mode = MODE_API_IMPORT.GROUP;
                        } else if (selectedFileType === FacebookDataType.GROUP_ADMINS) {
                          mode = MODE_API_IMPORT.ADMIN;
                        } else {
                          mode = MODE_API_IMPORT.DEFAULT;
                        }
                        processUpload(null, selectedFileType, selectedSourceType, mode, TYPE_API_IMPORT.ENTITIES) // tiếp tục mà không có UID
                      }}
                    >
                      Tiếp tục
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>

            <div
              className={`file-drop-area ${isDragging ? 'border-primary bg-primary/10' : ''} ${isProcessing ? 'opacity-60 cursor-wait' : ''} border-2 border-dashed rounded-lg p-8 text-center`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".xls,.xlsx"
                className="hidden"
                disabled={isProcessing}
              />
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <div className="text-center">
                <p className="font-medium text-gray-700 mb-1">Kéo thả file hoặc nhấn để chọn</p>
                <p className="text-sm text-gray-500">Chỉ hỗ trợ file Excel (.xls, .xlsx)</p>
                {!user && (
                  <p className="mt-2 text-sm text-primary font-medium">
                    Đăng nhập để lưu lại lịch sử tải lên của bạn
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-lg mb-3">Files đã chọn</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span>{file.rowCount} dòng</span>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{format(file.uploadDate, 'dd/MM/yyyy HH:mm')}</span>
                        </div>
                        <div className="flex items-center">
                          {getSourceTypeIcon(file.sourceType)}
                          <span>{getDataSourceTypeLabel(file.sourceType)}</span>
                        </div>
                        {file.sourceUID && (
                          <div className="flex items-center">
                            <span className="font-medium">UID: {file.sourceUID}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          {file.sourceUID ? (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                              {file.sourceUID}
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {sourceUID || 'Chưa có UID'}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">UID Nguồn</h4>
                          <Input
                            placeholder="Nhập UID"
                            defaultValue={file.sourceUID || ''}
                            onChange={(e) => updateSourceUID(index, e.target.value)}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                            {getFacebookDataTypeLabel(file.type)}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Chọn loại dữ liệu</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {FILE_TYPE_OPTIONS.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => updateFileType(index, option.value)}
                            className={file.type === option.value ? "bg-primary/10" : ""}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center">
                            {getSourceTypeIcon(file.sourceType)}
                            {getDataSourceTypeLabel(file.sourceType)}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Chọn nguồn dữ liệu</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {DATA_SOURCE_OPTIONS.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => updateSourceType(index, option.value)}
                            className={file.sourceType === option.value ? "bg-primary/10" : ""}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {file.processed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
