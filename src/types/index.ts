
export interface FacebookData {
  id: string;
  type: FacebookDataType;
  data: Record<string, any>;
}

export enum FacebookDataType {
  // 🔵 FRIENDS & RELATIONS
  FRIENDS = 'FRIENDS',
  NEW_FRIENDS = 'NEW_FRIENDS',
  REQUEST_FRIENDS = 'REQUEST_FRIENDS',
  FOLLOWING = 'FOLLOWING',
  FOLLOWERS = 'FOLLOWERS',

  INTERACTION_ON_POST = 'INTERACTION_ON_POST',
  INTERACTION_ON_ENTITY = 'INTERACTION_ON_ENTITY',

  // 👥 GROUP MEMBERS
  GROUP_MEMBERS = 'GROUP_MEMBERS',
  GROUP_COMMON_INTERESTS = 'GROUP_COMMON_INTERESTS',
  GROUP_MEMBER_FRIENDS = 'GROUP_MEMBER_FRIENDS',
  GROUP_NEARBY_MEMBERS = 'GROUP_NEARBY_MEMBERS',
  GROUP_MUTUAL_FRIENDS = 'GROUP_MUTUAL_FRIENDS',
  GROUP_FILTERED_MEMBERS = 'GROUP_FILTERED_MEMBERS',
  GROUP_TOP_CONTRIBUTORS = 'GROUP_TOP_CONTRIBUTORS',

  // 🔍 KEYWORD SEARCH
  SEARCH_GROUPS_BY_KEYWORD = 'SEARCH_GROUPS_BY_KEYWORD',
  SEARCH_PAGES_BY_KEYWORD = 'SEARCH_PAGES_BY_KEYWORD',
  SEARCH_EVENTS_BY_KEYWORD = 'SEARCH_EVENTS_BY_KEYWORD',
  SEARCH_PLACES_BY_KEYWORD = 'SEARCH_PLACES_BY_KEYWORD',
  SEARCH_PROFILES_BY_KEYWORD = 'SEARCH_PROFILES_BY_KEYWORD',

  // 🧑‍💻 UID-BASED TRACE
  GROUPS_JOINED_BY_UID = 'GROUPS_JOINED_BY_UID',
  PAGES_LIKED_BY_UID = 'PAGES_LIKED_BY_UID',
  PAGES_CHECKEDIN_BY_UID = 'PAGES_CHECKEDIN_BY_UID',
  GROUPS_SHARED_BY_UID = 'GROUPS_SHARED_BY_UID',
  RELATED_PAGES = 'RELATED_PAGES',

  // 👍 PAGE INTERACTIONS
  PAGE_LIKERS = 'PAGE_LIKERS',
  PAGE_TOP_FANS = 'PAGE_TOP_FANS',

  // 📊 STATS
  GROUP_POST_STATS = 'GROUP_POST_STATS',
  GROUP_INTERACTION_STATS = 'GROUP_INTERACTION_STATS',
  PAGE_INTERACTION_STATS = 'PAGE_INTERACTION_STATS',
  PROFILE_INTERACTION_STATS = 'PROFILE_INTERACTION_STATS',
  POST_LINK_INTERACTION_STATS = 'POST_LINK_INTERACTION_STATS',

  // 📅 EVENT DATA
  EVENT_ATTENDEES = 'EVENT_ATTENDEES',
  EVENT_COMMENTERS = 'EVENT_COMMENTERS',
  EVENT_INTERESTED = 'EVENT_INTERESTED',
  EVENT_INVITEES = 'EVENT_INVITEES',

  // 🔁 SHARE STATS
  POST_LINK_SHARE_STATS = 'POST_LINK_SHARE_STATS',
  UID_POST_SHARE_STATS = 'UID_POST_SHARE_STATS',
  PAGE_POST_SHARE_STATS = 'PAGE_POST_SHARE_STATS',
  SHARED_POST_IDS = 'SHARED_POST_IDS',

  // 📑 POST EXPLORATION
  POSTS_BY_PAGE_ID = 'POSTS_BY_PAGE_ID',
  POSTS_BY_GROUP_ID = 'POSTS_BY_GROUP_ID',
  POSTS_BY_PROFILE_ID = 'POSTS_BY_PROFILE_ID',
  POSTS_BY_TAG_ID = 'POSTS_BY_TAG_ID',
  POST_AUTHOR_IDS = 'POST_AUTHOR_IDS',

  // 💬 COMMENTS
  COMMENT_STATS_ON_LINK = 'COMMENT_STATS_ON_LINK',
  COMMENTS_ON_PAGE_BY_POST_COUNT = 'COMMENTS_ON_PAGE_BY_POST_COUNT',
  COMMENTS_ON_GROUP_BY_POST_COUNT = 'COMMENTS_ON_GROUP_BY_POST_COUNT',
  COMMENTS_ON_PROFILE_BY_POST_COUNT = 'COMMENTS_ON_PROFILE_BY_POST_COUNT',

  // 👮‍♂️ GROUP ADMIN & CONTROL
  GROUP_ADMINS = 'GROUP_ADMINS',
  GROUP_APPROVERS = 'GROUP_APPROVERS',

  // ⭐ PAGE RATINGS & VOTES
  PAGE_RATINGS = 'PAGE_RATINGS',
  GROUP_CHAT_MEMBERS = 'GROUP_CHAT_MEMBERS',
  POST_VOTERS = 'POST_VOTERS',

  // 🛒 MARKETPLACE
  MARKETPLACE_SELLERS = 'MARKETPLACE_SELLERS',

  // 🆕 EXTRA SEARCH
  SEARCH_GROUPS_BY_KEYWORD_V2 = 'SEARCH_GROUPS_BY_KEYWORD_V2',
  SUGGESTED_GROUPS = 'SUGGESTED_GROUPS',
  SEARCH_BY_CATEGORY = 'SEARCH_BY_CATEGORY',

  // ⚡ REALTIME & SPECIAL
  REALTIME_COMMENTS = 'REALTIME_COMMENTS',

  UNKNOWN = 'UNKNOWN',
}


export enum DataSourceType {
  UID_PROFILE = 'PROFILE',
  PAGE = 'PAGE',
  GROUP = 'GROUP'
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
    events: any[];
    interactions: any[];
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
  uploaderId: number;
  uploaderName?: string;
  size: number;
}

export const FILE_TYPE_OPTIONS = [
  
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
