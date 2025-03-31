
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
  UNKNOWN = 'unknown'
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
  name: string;
  type: FacebookDataType;
  data: any[];
  rowCount: number;
  processed: boolean;
}
