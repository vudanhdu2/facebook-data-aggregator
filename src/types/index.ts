export interface FacebookData {
  id: string;
  type: FacebookDataType;
  data: Record<string, any>;
}

export enum FacebookDataType {
  FRIENDS = 'friends',
  GROUPS = 'groups',
  POSTS = 'posts',
  COMMENTS = 'comments',
  PAGES_LIKED = 'pages_liked',
  CHECK_INS = 'check_ins',
  PROFILES = 'profiles',
  MESSAGES = 'messages',
  PHOTOS = 'photos',
  VIDEOS = 'videos',
  EVENTS = 'events',
  REACTIONS = 'reactions',
  UNKNOWN = 'unknown'
}

export enum DataSourceType {
  UID_PROFILE = 'uid_profile',
  PAGE = 'page',
  GROUP = 'group'
}

export interface UIDSource {
  fileName: string;
  fileType: FacebookDataType;
  timestamp: Date;
  sourceType?: DataSourceType;
  sourceUID?: string;
}

export enum UserRole {
  MEMBER = 'member',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
}

export interface AggregatedUserData {
  uid: string;
  name?: string;
  friendsCount: number;
  groupsCount: number;
  postsCount: number;
  commentsCount: number;
  pagesLikedCount: number;
  checkInsCount: number;
  lastActive?: Date;
  sources: UIDSource[];
  data: {
    friends: any[];
    groups: any[];
    posts: any[];
    comments: any[];
    pagesLiked: any[];
    checkIns: any[];
  };
}

export interface UploadedFile {
  id: string;
  name: string;
  type: FacebookDataType;
  data: any[];
  rowCount: number;
  processed: boolean;
  manualType?: boolean;
  uploadDate: Date;
  sourceType: DataSourceType;
  sourceUID?: string;
  uploaderId: string;
  uploaderName?: string;
}

export const FILE_TYPE_OPTIONS = [
  { value: FacebookDataType.FRIENDS, label: 'Danh sách bạn bè' },
  { value: FacebookDataType.GROUPS, label: 'Danh sách nhóm' },
  { value: FacebookDataType.POSTS, label: 'Danh sách bài đăng' },
  { value: FacebookDataType.COMMENTS, label: 'Danh sách bình luận' },
  { value: FacebookDataType.PAGES_LIKED, label: 'Danh sách trang đã thích' },
  { value: FacebookDataType.CHECK_INS, label: 'Danh sách địa điểm đã check-in' },
  { value: FacebookDataType.PROFILES, label: 'Thông tin hồ sơ người dùng' },
  { value: FacebookDataType.MESSAGES, label: 'Tin nhắn và cuộc trò chuyện' },
  { value: FacebookDataType.PHOTOS, label: 'Ảnh đã đăng' },
  { value: FacebookDataType.VIDEOS, label: 'Video đã đăng' },
  { value: FacebookDataType.EVENTS, label: 'Sự kiện đã tham gia' },
  { value: FacebookDataType.REACTIONS, label: 'Các biểu cảm (reaction)' },
  { value: FacebookDataType.UNKNOWN, label: 'Không xác định' }
];

export const DATA_SOURCE_OPTIONS = [
  { value: DataSourceType.UID_PROFILE, label: 'Hồ sơ người dùng' },
  { value: DataSourceType.PAGE, label: 'Trang' },
  { value: DataSourceType.GROUP, label: 'Nhóm' }
];

export const USER_ROLE_OPTIONS = [
  { value: UserRole.MEMBER, label: 'Thành viên' },
  { value: UserRole.ADMIN, label: 'Quản trị viên' }
];
