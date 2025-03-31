
import { FacebookDataType, UploadedFile, DataSourceType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper functions to generate random data
const getRandomName = (): string => {
  const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
  const middleNames = ['Văn', 'Thị', 'Hồng', 'Đức', 'Minh', 'Hoàng', 'Quốc', 'Thành', 'Đình', 'Thanh', 'Ngọc', 'Xuân', 'Hữu', 'Gia', 'Kim'];
  const lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Em', 'Phong', 'Giang', 'Hải', 'Hương', 'Khang', 'Linh', 'Mai', 'Nam', 'Oanh', 'Phúc', 'Quân', 'Thảo', 'Uyên', 'Vân', 'Yến'];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const getRandomUID = (prefix = '10000'): string => {
  return prefix + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
};

const getRandomDateInRange = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomDate = (startYear = 2017, endYear = 2023): Date => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  return getRandomDateInRange(start, end);
};

const getRandomId = (prefix: string): string => {
  return prefix + Math.floor(Math.random() * 1000000000).toString();
};

const getRandomPost = (): string => {
  const posts = [
    'Hôm nay trời đẹp quá!',
    'Vừa đi ăn ở quán mới, rất ngon và giá phải chăng.',
    'Cuối tuần này ai có kế hoạch gì không?',
    'Mới đọc xong cuốn sách hay, giới thiệu cho mọi người.',
    'Hôm nay mình buồn quá, cần lời khuyên.',
    'Chúc mừng sinh nhật bạn tôi!',
    'Mới mua điện thoại mới, rất hài lòng với sản phẩm.',
    'Cần tìm nhà trọ khu vực Cầu Giấy, ai biết chỗ nào không?',
    'Đang tìm việc làm thêm, mọi người giới thiệu mình với.',
    'Kỷ niệm 5 năm yêu nhau, hạnh phúc quá!',
    'Mới hoàn thành khóa học online, rất hữu ích.',
    'Đang tìm partner đi du lịch Đà Lạt cuối tháng này.',
    'Hôm nay là ngày đầu tiên đi làm, hồi hộp quá!',
    'Ai biết quán café nào yên tĩnh để làm việc ở Hà Nội không?',
    'Mới nhận được tin vui, muốn chia sẻ với mọi người.',
    'Dự án mới của mình sắp ra mắt, mong mọi người ủng hộ!',
    'Đang cân nhắc chuyển công việc, có ai làm ngành này không?',
    'Vừa xem xong bộ phim hay, đề xuất cho mọi người.',
    'Cuối tuần vừa rồi đi Sapa, cảnh đẹp quá!',
    'Món quà sinh nhật ý nghĩa nhất bạn từng nhận là gì?',
    'Đang tìm kiếm một khóa học tiếng Anh chất lượng.',
    'Có ai biết chỗ sửa máy tính uy tín không?',
    'Vừa mất ví ở khu vực Hoàn Kiếm, ai nhặt được xin liên hệ.',
    'Đang cần tìm bạn cùng phòng khu vực Cầu Giấy.',
    'Mình đang cần tư vấn về kế hoạch tài chính cá nhân.',
    'Ai có kinh nghiệm làm việc tự do không?',
    'Có ai biết nơi nào dạy piano tốt cho người mới bắt đầu không?',
    'Mới chuyển đến Hà Nội, cần tìm hội nhóm để kết nối.'
  ];
  return posts[Math.floor(Math.random() * posts.length)];
};

const getRandomComment = (): string => {
  const comments = [
    'Rất hay, cảm ơn bạn đã chia sẻ!',
    'Mình cũng nghĩ vậy.',
    'Hoàn toàn đồng ý với quan điểm của bạn.',
    'Bài viết rất hữu ích.',
    'Cảm ơn thông tin!',
    'Mình chưa biết điều này, cảm ơn.',
    'Thật thú vị!',
    'Chúc mừng bạn nhé!',
    'Mình sẽ thử làm theo.',
    'Bạn có thể chia sẻ thêm không?',
    'Mình đã trải nghiệm rồi, rất tuyệt!',
    'Tôi không đồng ý lắm.',
    'Bạn nói đúng!',
    'Quan điểm rất hay!',
    'Cảm ơn đã chia sẻ kinh nghiệm.',
    'Mình cũng từng gặp vấn đề tương tự.',
    'Vậy thì thử cách khác xem sao?',
    'Để mình thử nghiệm xem sao.',
    'Không biết có hiệu quả không nhỉ?',
    'Địa điểm này mình đã đến rồi, rất tuyệt vời!',
    'Đúng là như vậy, mình hoàn toàn ủng hộ.',
    'Cách giải quyết khá hay đấy.',
    'Ý tưởng này rất sáng tạo!',
    'Mình không nghĩ vậy, nhưng cũng thú vị.',
    'Có thể cho mình xin thêm chi tiết không?',
    'Thông tin này đúng là mình đang cần.',
    'Thử cách này xem, mình nghĩ sẽ hiệu quả hơn.',
    'Mình đã áp dụng và thấy rất tốt!',
    'Có ai đã thử cách này chưa?',
    'Mình cũng đang tìm hiểu về vấn đề này.'
  ];
  return comments[Math.floor(Math.random() * comments.length)];
};

const getRandomGroupName = (): string => {
  const prefixes = ['Hội', 'Nhóm', 'Cộng đồng', 'CLB', 'Group', 'Team', 'Diễn đàn', 'Mạng lưới'];
  const topics = [
    'những người yêu thích du lịch', 'chia sẻ kinh nghiệm học tiếng Anh', 'ẩm thực Việt Nam',
    'chụp ảnh', 'review phim', 'hỏi đáp công nghệ', 'tìm việc làm IT',
    'mua bán đồ cũ', 'đam mê âm nhạc', 'thể thao', 'đọc sách', 'làm đẹp',
    'ô tô xe máy', 'giáo dục sớm', 'phượt', 'thú cưng', 'thời trang',
    'tâm sự', 'đầu tư tài chính', 'nhà đất',
    'marketing online', 'chạy bộ', 'yoga', 'nấu ăn', 'làm bánh',
    'học ngoại ngữ', 'freelancer Việt Nam', 'startup', 'blockchain',
    'nhiếp ảnh', 'review đồ công nghệ', 'chia sẻ code', 'machine learning'
  ];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${topics[Math.floor(Math.random() * topics.length)]}`;
};

const getRandomPageName = (): string => {
  const prefixes = ['Tin tức', 'Trang', 'Kênh', 'Cộng đồng', 'Shop', 'Studio', 'Blog', 'Diễn đàn', 'TVN'];
  const topics = [
    'công nghệ', 'du lịch và khám phá', 'ẩm thực Việt Nam', 'học tiếng Anh mỗi ngày',
    'sách hay nên đọc', 'thời trang', 'làm đẹp', 'đồ handmade', 'review phim',
    'nhạc trẻ', 'thể thao', 'kinh doanh online', 'động lực mỗi ngày',
    'chia sẻ kiến thức', 'mẹo vặt cuộc sống', 'du học', 'nghệ thuật sống',
    'ô tô xe máy', 'khởi nghiệp', 'giải trí',
    'game online', 'kiến trúc', 'thiết kế nội thất', 'làm vườn',
    'ẩm thực Á', 'ẩm thực Âu', 'phim Hàn', 'crypto', 'đầu tư chứng khoán',
    'review sách', 'học lập trình', 'smartphone', 'máy ảnh', 'cà phê sáng'
  ];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${topics[Math.floor(Math.random() * topics.length)]}`;
};

const getRandomPlaceName = (): string => {
  const placeTypes = ['Quán cà phê', 'Nhà hàng', 'Trung tâm thương mại', 'Công viên', 'Rạp chiếu phim', 
    'Khách sạn', 'Resort', 'Bảo tàng', 'Thư viện', 'Phòng gym', 'Trường đại học', 
    'Bệnh viện', 'Sân bay', 'Ga tàu', 'Bến xe', 'Siêu thị', 'Trường học', 'Công ty', 
    'Vườn hoa', 'Khu du lịch', 'Núi', 'Biển', 'Hồ', 'Thác nước', 'Đền', 'Chùa'];
  
  const placeNames = ['Hà Nội', 'Sài Gòn', 'Đà Nẵng', 'Nha Trang', 'Huế', 'Hạ Long', 'Sapa', 
    'Đà Lạt', 'Phú Quốc', 'Quy Nhơn', 'Vũng Tàu', 'Hội An', 'Cần Thơ', 'Hải Phòng',
    'Ninh Bình', 'Thanh Hóa', 'Lào Cai', 'Quảng Ninh', 'Nghệ An', 'Hà Tĩnh', 
    'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 'Quảng Nam', 'Quảng Ngãi', 
    'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận'];

  return `${placeTypes[Math.floor(Math.random() * placeTypes.length)]} ${placeNames[Math.floor(Math.random() * placeNames.length)]}`;
};

const getRandomMemberCount = (): number => {
  return Math.floor(Math.random() * 100000) + 1000;
};

const getRandomInteractionCounts = (): { likes: number, comments: number, shares: number } => {
  return {
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50)
  };
};

// Function to generate a comprehensive dataset for a single user
const generateComprehensiveUserData = (userId: string, userName: string): {
  friends: any[],
  posts: any[],
  comments: any[],
  groups: any[],
  pagesLiked: any[],
  checkIns: any[]
} => {
  // Generate friends (300-500 friends)
  const friendsCount = Math.floor(Math.random() * 200) + 300;
  const friends = Array.from({ length: friendsCount }, () => ({
    uid: getRandomUID(),
    name: getRandomName(),
    friend_since: getRandomDate()
  }));

  // Generate posts (300-500 posts over time)
  const postsCount = Math.floor(Math.random() * 200) + 300;
  const posts = Array.from({ length: postsCount }, () => {
    const interactions = getRandomInteractionCounts();
    return { 
      uid: userId, 
      post_id: getRandomId('post'), 
      content: getRandomPost(), 
      posted_at: getRandomDate(),
      likes: interactions.likes,
      comments: interactions.comments,
      shares: interactions.shares
    };
  });

  // Generate comments (400-700 comments)
  const commentsCount = Math.floor(Math.random() * 300) + 400;
  const comments = Array.from({ length: commentsCount }, () => ({ 
    uid: userId, 
    comment_id: getRandomId('cmt'), 
    content: getRandomComment(), 
    commented_at: getRandomDate(),
    likes: Math.floor(Math.random() * 50),
    post_id: getRandomId('post'),
    post_owner_id: getRandomUID()
  }));

  // Generate groups (50-100 groups)
  const groupsCount = Math.floor(Math.random() * 50) + 50;
  const groups = Array.from({ length: groupsCount }, () => ({ 
    uid: userId, 
    group_id: getRandomId('group'), 
    group_name: getRandomGroupName(), 
    joined_at: getRandomDate(),
    member_count: getRandomMemberCount()
  }));

  // Generate pages liked (100-200 pages)
  const pagesCount = Math.floor(Math.random() * 100) + 100;
  const pagesLiked = Array.from({ length: pagesCount }, () => ({ 
    uid: userId, 
    page_id: getRandomId('page'), 
    page_name: getRandomPageName(), 
    liked_at: getRandomDate()
  }));

  // Generate check-ins (50-100 locations)
  const checkInsCount = Math.floor(Math.random() * 50) + 50;
  const checkIns = Array.from({ length: checkInsCount }, () => ({
    uid: userId,
    location_id: getRandomId('loc'),
    location_name: getRandomPlaceName(),
    checked_in_at: getRandomDate(),
    coordinates: {
      lat: (Math.random() * 20) + 10, // Approximate latitude for Vietnam
      lng: (Math.random() * 10) + 100  // Approximate longitude for Vietnam
    }
  }));

  return {
    friends,
    posts,
    comments,
    groups,
    pagesLiked,
    checkIns
  };
};

export const createDemoData = (largeDataset = false): UploadedFile[] => {
  // Generate current timestamp
  const now = new Date();
  
  // For large dataset, create one user with comprehensive data
  if (largeDataset) {
    const userId = getRandomUID();
    const userName = getRandomName();
    
    const userData = generateComprehensiveUserData(userId, userName);
    
    // Create files for each data type with the generated data
    const friendsFile: UploadedFile = {
      id: uuidv4(),
      name: "friends_list_large.xlsx",
      type: FacebookDataType.FRIENDS,
      data: userData.friends,
      rowCount: userData.friends.length,
      processed: true,
      uploadDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      sourceType: DataSourceType.UID_PROFILE,
      uploaderId: 'demo',
      uploaderName: 'Người dùng Demo'
    };

    const postsFile: UploadedFile = {
      id: uuidv4(),
      name: "posts_data_large.xlsx",
      type: FacebookDataType.POSTS,
      data: userData.posts,
      rowCount: userData.posts.length,
      processed: true,
      uploadDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      sourceType: DataSourceType.UID_PROFILE,
      uploaderId: 'demo',
      uploaderName: 'Người dùng Demo'
    };

    const commentsFile: UploadedFile = {
      id: uuidv4(),
      name: "comments_data_large.xlsx",
      type: FacebookDataType.COMMENTS,
      data: userData.comments,
      rowCount: userData.comments.length,
      processed: true,
      uploadDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      sourceType: DataSourceType.UID_PROFILE,
      uploaderId: 'demo',
      uploaderName: 'Người dùng Demo'
    };

    const groupsFile: UploadedFile = {
      id: uuidv4(),
      name: "groups_data_large.xlsx",
      type: FacebookDataType.GROUPS,
      data: userData.groups,
      rowCount: userData.groups.length,
      processed: true,
      uploadDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      sourceType: DataSourceType.UID_PROFILE,
      uploaderId: 'demo',
      uploaderName: 'Người dùng Demo'
    };

    const pagesLikedFile: UploadedFile = {
      id: uuidv4(),
      name: "pages_liked_large.xlsx",
      type: FacebookDataType.PAGES_LIKED,
      data: userData.pagesLiked,
      rowCount: userData.pagesLiked.length,
      processed: true,
      uploadDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      sourceType: DataSourceType.UID_PROFILE,
      uploaderId: 'demo',
      uploaderName: 'Người dùng Demo'
    };

    const checkInsFile: UploadedFile = {
      id: uuidv4(),
      name: "check_ins_large.xlsx",
      type: FacebookDataType.CHECK_INS,
      data: userData.checkIns,
      rowCount: userData.checkIns.length,
      processed: true,
      uploadDate: new Date(now.getTime()),
      sourceType: DataSourceType.UID_PROFILE,
      uploaderId: 'demo',
      uploaderName: 'Người dùng Demo'
    };

    return [friendsFile, postsFile, commentsFile, groupsFile, pagesLikedFile, checkInsFile];
  }
  
  // Default behavior for regular-sized dataset
  // Generate 200 users with consistent UIDs to use across data types
  const demoUsers = Array.from({ length: 200 }, () => ({
    uid: getRandomUID(),
    name: getRandomName()
  }));
  
  // Demo file 1: Friends list (250 records)
  const friendsData = [];
  for (let i = 0; i < 250; i++) {
    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    friendsData.push({
      uid: user.uid,
      name: user.name,
      friend_since: getRandomDate()
    });
  }
  
  const friendsFile: UploadedFile = {
    id: uuidv4(),
    name: "friends_list.xlsx",
    type: FacebookDataType.FRIENDS,
    data: friendsData,
    rowCount: friendsData.length,
    processed: true,
    uploadDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  // Demo file 2: Posts data (250 records)
  const postsData = [];
  for (let i = 0; i < 250; i++) {
    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    const interactions = getRandomInteractionCounts();
    postsData.push({ 
      uid: user.uid, 
      post_id: getRandomId('post'), 
      content: getRandomPost(), 
      posted_at: getRandomDate(),
      likes: interactions.likes,
      comments: interactions.comments,
      shares: interactions.shares
    });
  }
  
  const postsFile: UploadedFile = {
    id: uuidv4(),
    name: "posts_data.xlsx",
    type: FacebookDataType.POSTS,
    data: postsData,
    rowCount: postsData.length,
    processed: true,
    uploadDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  // Demo file 3: Comments data (200 records)
  const commentsData = [];
  for (let i = 0; i < 200; i++) {
    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    commentsData.push({ 
      uid: user.uid, 
      comment_id: getRandomId('cmt'), 
      content: getRandomComment(), 
      commented_at: getRandomDate(),
      likes: Math.floor(Math.random() * 50),
      post_id: getRandomId('post'),
      post_owner_id: getRandomUID()
    });
  }
  
  const commentsFile: UploadedFile = {
    id: uuidv4(),
    name: "comments_data.xlsx",
    type: FacebookDataType.COMMENTS,
    data: commentsData,
    rowCount: commentsData.length,
    processed: true,
    uploadDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  // Demo file 4: Groups data (150 records)
  const groupsData = [];
  for (let i = 0; i < 150; i++) {
    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    groupsData.push({ 
      uid: user.uid, 
      group_id: getRandomId('group'), 
      group_name: getRandomGroupName(), 
      joined_at: getRandomDate(),
      member_count: getRandomMemberCount()
    });
  }
  
  const groupsFile: UploadedFile = {
    id: uuidv4(),
    name: "groups_data.xlsx",
    type: FacebookDataType.GROUPS,
    data: groupsData,
    rowCount: groupsData.length,
    processed: true,
    uploadDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  // Demo file 5: Pages liked data (200 records)
  const pagesLikedData = [];
  for (let i = 0; i < 200; i++) {
    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    pagesLikedData.push({ 
      uid: user.uid, 
      page_id: getRandomId('page'), 
      page_name: getRandomPageName(), 
      liked_at: getRandomDate()
    });
  }
  
  const pagesLikedFile: UploadedFile = {
    id: uuidv4(),
    name: "pages_liked.xlsx",
    type: FacebookDataType.PAGES_LIKED,
    data: pagesLikedData,
    rowCount: pagesLikedData.length,
    processed: true,
    uploadDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    sourceType: DataSourceType.UID_PROFILE,
    uploaderId: 'demo',
    uploaderName: 'Người dùng Demo'
  };

  return [friendsFile, postsFile, commentsFile, groupsFile, pagesLikedFile];
};
