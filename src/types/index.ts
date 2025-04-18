
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
  GROUP = 'GROUP',
  EVENT = 'EVENT',
  PLACE = 'PLACE',
  POST = 'POST',
  COMMENT = 'COMMENT',
  MARKETPLACE = 'MARKETPLACE',
  GROUP_CHAT = 'GROUP_CHAT',
}

export enum MODE_API_IMPORT {
  GROUP = 'group',
  DEFAULT = 'default',
  ADMIN = 'admin',
}

export enum TYPE_API_IMPORT {
  ENTITIES = 'entities',
  COMMENTS = 'comments',
  LIKES = 'likes',
  SHARES = 'shares',
  POSTS = 'posts',
  STATS = 'stats',
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
  { value: FacebookDataType.FRIENDS, label: 'Tìm UID bạn bè' },
  { value: FacebookDataType.NEW_FRIENDS, label: 'Bạn bè mới thêm' },
  { value: FacebookDataType.REQUEST_FRIENDS, label: 'UID đã gửi yêu cầu kết bạn' },
  { value: FacebookDataType.FOLLOWING, label: 'Tìm UID Following' },
  { value: FacebookDataType.FOLLOWERS, label: 'Tìm UID Followers' },
  { value: FacebookDataType.INTERACTION_ON_POST, label: 'Tìm UID like, comment, share, tag trong ID bài viết' },
  { value: FacebookDataType.INTERACTION_ON_ENTITY, label: 'Tìm UID tương tác trong Page, Group hoặc Live' },
  { value: FacebookDataType.GROUP_MEMBERS, label: 'Tìm thành viên nhóm' },
  { value: FacebookDataType.GROUP_COMMON_INTERESTS, label: 'Thành viên nhóm có điểm chung' },
  { value: FacebookDataType.GROUP_MEMBER_FRIENDS, label: 'Bạn bè trong nhóm' },
  { value: FacebookDataType.GROUP_NEARBY_MEMBERS, label: 'Thành viên gần' },
  { value: FacebookDataType.GROUP_MUTUAL_FRIENDS, label: 'Thành viên có bạn chung' },
  { value: FacebookDataType.GROUP_FILTERED_MEMBERS, label: 'Tìm thành viên nhóm theo điều kiện' },
  { value: FacebookDataType.GROUP_TOP_CONTRIBUTORS, label: 'Thành viên đóng góp nhiều' },
  { value: FacebookDataType.SEARCH_GROUPS_BY_KEYWORD, label: 'Tìm ID nhóm theo từ khóa' },
  { value: FacebookDataType.SEARCH_PAGES_BY_KEYWORD, label: 'Tìm ID page theo từ khóa' },
  { value: FacebookDataType.SEARCH_EVENTS_BY_KEYWORD, label: 'Tìm ID event theo từ khóa' },
  { value: FacebookDataType.SEARCH_PLACES_BY_KEYWORD, label: 'Tìm ID place theo từ khóa' },
  { value: FacebookDataType.SEARCH_PROFILES_BY_KEYWORD, label: 'Tìm ID profile theo từ khóa' },
  { value: FacebookDataType.GROUPS_JOINED_BY_UID, label: 'Tìm ID nhóm đã tham gia của UID' },
  { value: FacebookDataType.PAGES_LIKED_BY_UID, label: 'Tìm ID page đã like của UID' },
  { value: FacebookDataType.PAGES_CHECKEDIN_BY_UID, label: 'Tìm ID page đã checkin của UID' },
  { value: FacebookDataType.GROUPS_SHARED_BY_UID, label: 'Tìm ID nhóm đã share của UID' },
  { value: FacebookDataType.RELATED_PAGES, label: 'Tìm ID page liên quan' },
  { value: FacebookDataType.PAGE_LIKERS, label: 'Tìm UID người đã like page' },
  { value: FacebookDataType.PAGE_TOP_FANS, label: 'Tìm UID fan cứng' },
  { value: FacebookDataType.GROUP_POST_STATS, label: 'Thống kê lượt đăng của Group' },
  { value: FacebookDataType.GROUP_INTERACTION_STATS, label: 'Thống kê tương tác của Group' },
  { value: FacebookDataType.PAGE_INTERACTION_STATS, label: 'Thống kê tương tác của Page' },
  { value: FacebookDataType.PROFILE_INTERACTION_STATS, label: 'Thống kê tương tác của Profile' },
  { value: FacebookDataType.POST_LINK_INTERACTION_STATS, label: 'Thống kê tương tác của link bài viết' },
  { value: FacebookDataType.EVENT_ATTENDEES, label: 'Tìm UID tham gia Event' },
  { value: FacebookDataType.EVENT_COMMENTERS, label: 'Tìm UID comment Event' },
  { value: FacebookDataType.EVENT_INTERESTED, label: 'Tìm UID quan tâm Event' },
  { value: FacebookDataType.EVENT_INVITEES, label: 'Tìm UID đã mời tham gia Event' },
  { value: FacebookDataType.POST_LINK_SHARE_STATS, label: 'Thống kê share bài của link' },
  { value: FacebookDataType.UID_POST_SHARE_STATS, label: 'Thống kê share bài của UID' },
  { value: FacebookDataType.PAGE_POST_SHARE_STATS, label: 'Thống kê share bài của Page' },
  { value: FacebookDataType.SHARED_POST_IDS, label: 'Tìm ID bài viết đã share' },
  { value: FacebookDataType.POSTS_BY_PAGE_ID, label: 'Quét danh sách bài theo ID page' },
  { value: FacebookDataType.POSTS_BY_GROUP_ID, label: 'Quét danh sách bài theo ID group' },
  { value: FacebookDataType.POSTS_BY_PROFILE_ID, label: 'Quét danh sách bài theo ID profile' },
  { value: FacebookDataType.POSTS_BY_TAG_ID, label: 'Quét danh sách bài theo ID tag' },
  { value: FacebookDataType.POST_AUTHOR_IDS, label: 'Quét ID đăng bài' },
  { value: FacebookDataType.COMMENT_STATS_ON_LINK, label: 'Thống kê comment trong link bài viết' },
  { value: FacebookDataType.COMMENTS_ON_PAGE_BY_POST_COUNT, label: 'Tìm comment trên Page theo số bài' },
  { value: FacebookDataType.COMMENTS_ON_GROUP_BY_POST_COUNT, label: 'Tìm comment trên Group theo số bài' },
  { value: FacebookDataType.COMMENTS_ON_PROFILE_BY_POST_COUNT, label: 'Tìm comment trên Profile theo số bài' },
  { value: FacebookDataType.GROUP_ADMINS, label: 'Tìm UID admin nhóm' },
  { value: FacebookDataType.GROUP_APPROVERS, label: 'Tìm UID chấp thuận trước' },
  { value: FacebookDataType.PAGE_RATINGS, label: 'Tìm UID đánh giá Page' },
  { value: FacebookDataType.GROUP_CHAT_MEMBERS, label: 'Tìm UID thành viên nhóm chat' },
  { value: FacebookDataType.POST_VOTERS, label: 'Tìm UID vote bài viết' },
  { value: FacebookDataType.MARKETPLACE_SELLERS, label: 'Tìm UID đăng sản phẩm Marketplace' },
  { value: FacebookDataType.SEARCH_GROUPS_BY_KEYWORD_V2, label: 'Tìm nhóm theo từ khóa (v2)' },
  { value: FacebookDataType.SUGGESTED_GROUPS, label: 'Tải nhóm gợi ý' },
  { value: FacebookDataType.SEARCH_BY_CATEGORY, label: 'Tìm nhóm theo thể loại' },
  { value: FacebookDataType.REALTIME_COMMENTS, label: 'Quét comment realtime Page, Group, Link' }
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
