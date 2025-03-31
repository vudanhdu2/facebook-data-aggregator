
import { FacebookDataType, UploadedFile, DataSourceType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const createDemoData = (): UploadedFile[] => {
  // Generate current timestamp
  const now = new Date();
  
  // Demo file 1: Friends list
  const friendsFile: UploadedFile = {
    id: uuidv4(),
    name: "friends_list.xlsx",
    type: FacebookDataType.FRIENDS,
    data: [
      { uid: "100001234567890", name: "Nguyễn Văn A", friend_since: "2018-05-12" },
      { uid: "100002345678901", name: "Trần Thị B", friend_since: "2019-02-15" },
      { uid: "100003456789012", name: "Lê Văn C", friend_since: "2020-07-20" },
      { uid: "100004567890123", name: "Phạm Thị D", friend_since: "2017-11-05" },
      { uid: "100005678901234", name: "Hoàng Văn E", friend_since: "2021-03-30" }
    ],
    rowCount: 5,
    processed: true,
    uploadDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  // Demo file 2: Posts data
  const postsFile: UploadedFile = {
    id: uuidv4(),
    name: "posts_data.xlsx",
    type: FacebookDataType.POSTS,
    data: [
      { 
        uid: "100001234567890", 
        post_id: "post123456789", 
        content: "Hôm nay là một ngày đẹp trời!", 
        posted_at: "2023-01-15",
        likes: 25,
        comments: 7,
        shares: 2
      },
      { 
        uid: "100001234567890", 
        post_id: "post234567890", 
        content: "Đi chơi cuối tuần với bạn bè", 
        posted_at: "2023-02-20",
        likes: 42,
        comments: 15,
        shares: 5
      },
      { 
        uid: "100002345678901", 
        post_id: "post345678901", 
        content: "Chia sẻ công thức nấu ăn mới", 
        posted_at: "2023-03-10",
        likes: 18,
        comments: 8,
        shares: 3
      }
    ],
    rowCount: 3,
    processed: true,
    uploadDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  // Demo file 3: Comments data
  const commentsFile: UploadedFile = {
    id: uuidv4(),
    name: "comments_data.xlsx",
    type: FacebookDataType.COMMENTS,
    data: [
      { 
        uid: "100001234567890", 
        comment_id: "cmt123456789", 
        content: "Rất hay, cảm ơn bạn đã chia sẻ!", 
        commented_at: "2023-04-05",
        likes: 3,
        post_id: "post987654321",
        post_owner_id: "100009876543210"
      },
      { 
        uid: "100002345678901", 
        comment_id: "cmt234567890", 
        content: "Tôi rất thích bài viết này", 
        commented_at: "2023-04-10",
        likes: 5,
        post_id: "post876543210",
        post_owner_id: "100008765432109"
      }
    ],
    rowCount: 2,
    processed: true,
    uploadDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  // Demo file 4: Groups data
  const groupsFile: UploadedFile = {
    id: uuidv4(),
    name: "groups_data.xlsx",
    type: FacebookDataType.GROUPS,
    data: [
      { 
        uid: "100001234567890", 
        group_id: "group123456789", 
        group_name: "Hội những người yêu thích du lịch", 
        joined_at: "2022-08-15",
        member_count: 5820
      },
      { 
        uid: "100001234567890", 
        group_id: "group234567890", 
        group_name: "Chia sẻ kinh nghiệm học tiếng Anh", 
        joined_at: "2021-12-10",
        member_count: 12450
      },
      { 
        uid: "100002345678901", 
        group_id: "group345678901", 
        group_name: "Hội ẩm thực Việt Nam", 
        joined_at: "2022-03-22",
        member_count: 8735
      }
    ],
    rowCount: 3,
    processed: true,
    uploadDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  // Demo file 5: Pages liked data
  const pagesLikedFile: UploadedFile = {
    id: uuidv4(),
    name: "pages_liked.xlsx",
    type: FacebookDataType.PAGES_LIKED,
    data: [
      { 
        uid: "100001234567890", 
        page_id: "page123456789", 
        page_name: "Tin tức công nghệ", 
        liked_at: "2022-05-18"
      },
      { 
        uid: "100001234567890", 
        page_id: "page234567890", 
        page_name: "Du lịch và khám phá", 
        liked_at: "2021-11-23"
      },
      { 
        uid: "100002345678901", 
        page_id: "page345678901", 
        page_name: "Ẩm thực Việt Nam", 
        liked_at: "2022-01-15"
      },
      { 
        uid: "100002345678901", 
        page_id: "page456789012", 
        page_name: "Học tiếng Anh mỗi ngày", 
        liked_at: "2022-07-22"
      },
      { 
        uid: "100003456789012", 
        page_id: "page567890123", 
        page_name: "Sách hay nên đọc", 
        liked_at: "2022-09-14"
      }
    ],
    rowCount: 5,
    processed: true,
    uploadDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  return [friendsFile, postsFile, commentsFile, groupsFile, pagesLikedFile];
};
