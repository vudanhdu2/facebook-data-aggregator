import { FacebookData, FacebookDataType, AggregatedUserData, UploadedFile } from '../types';
import * as XLSX from 'xlsx';

export async function readExcelFile(file: File): Promise<UploadedFile | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Try to determine the data type from headers or content
        const dataType = determineDataType(jsonData, file.name);
        
        resolve({
          name: file.name,
          type: dataType,
          data: jsonData,
          rowCount: jsonData.length,
          processed: false,
          manualType: false
        });
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
}

function determineDataType(data: any[], fileName: string): FacebookDataType {
  if (!data || data.length === 0) return FacebookDataType.UNKNOWN;
  
  const firstRow = data[0];
  const headers = Object.keys(firstRow).map(h => h.toLowerCase());
  const fileNameLower = fileName.toLowerCase();
  
  // Check filename first for quick determination
  if (fileNameLower.includes('friend') || fileNameLower.includes('bạn')) {
    return FacebookDataType.FRIENDS;
  } else if (fileNameLower.includes('group') || fileNameLower.includes('nhóm')) {
    return FacebookDataType.GROUPS;
  } else if (fileNameLower.includes('post') || fileNameLower.includes('bài')) {
    return FacebookDataType.POSTS;
  } else if (fileNameLower.includes('comment') || fileNameLower.includes('bình luận')) {
    return FacebookDataType.COMMENTS;
  } else if (fileNameLower.includes('page') || fileNameLower.includes('trang')) {
    return FacebookDataType.PAGES_LIKED;
  } else if (fileNameLower.includes('check') || fileNameLower.includes('địa điểm')) {
    return FacebookDataType.CHECK_INS;
  } else if (fileNameLower.includes('profile') || fileNameLower.includes('hồ sơ')) {
    return FacebookDataType.PROFILES;
  } else if (fileNameLower.includes('message') || fileNameLower.includes('tin nhắn')) {
    return FacebookDataType.MESSAGES;
  } else if (fileNameLower.includes('photo') || fileNameLower.includes('ảnh')) {
    return FacebookDataType.PHOTOS;
  } else if (fileNameLower.includes('video')) {
    return FacebookDataType.VIDEOS;
  } else if (fileNameLower.includes('event') || fileNameLower.includes('sự kiện')) {
    return FacebookDataType.EVENTS;
  } else if (fileNameLower.includes('reaction') || fileNameLower.includes('biểu cảm')) {
    return FacebookDataType.REACTIONS;
  }
  
  // If filename doesn't give us clues, check headers
  if (headers.some(h => h.includes('friend') || h.includes('bạn'))) {
    return FacebookDataType.FRIENDS;
  } else if (headers.some(h => h.includes('group') || h.includes('nhóm'))) {
    return FacebookDataType.GROUPS;
  } else if (headers.some(h => h.includes('post') || h.includes('bài'))) {
    return FacebookDataType.POSTS;
  } else if (headers.some(h => h.includes('comment') || h.includes('bình luận'))) {
    return FacebookDataType.COMMENTS;
  } else if (headers.some(h => h.includes('page') || h.includes('trang'))) {
    return FacebookDataType.PAGES_LIKED;
  } else if (headers.some(h => h.includes('check') || h.includes('địa điểm'))) {
    return FacebookDataType.CHECK_INS;
  }
  
  return FacebookDataType.UNKNOWN;
}

export function aggregateDataByUID(files: UploadedFile[]): AggregatedUserData[] {
  const userMap = new Map<string, AggregatedUserData>();
  
  files.forEach(file => {
    file.data.forEach(item => {
      let uid = extractUID(item, file.type);
      
      if (!uid) return; // Skip if no UID found
      
      if (!userMap.has(uid)) {
        userMap.set(uid, {
          uid,
          name: extractName(item, file.type),
          friendsCount: 0,
          groupsCount: 0,
          postsCount: 0,
          commentsCount: 0,
          pagesLikedCount: 0,
          checkInsCount: 0,
          data: {
            friends: [],
            groups: [],
            posts: [],
            comments: [],
            pagesLiked: [],
            checkIns: []
          }
        });
      }
      
      const userData = userMap.get(uid)!;
      
      switch (file.type) {
        case FacebookDataType.FRIENDS:
          userData.friendsCount++;
          userData.data.friends.push(item);
          break;
        case FacebookDataType.GROUPS:
          userData.groupsCount++;
          userData.data.groups.push(item);
          break;
        case FacebookDataType.POSTS:
          userData.postsCount++;
          userData.data.posts.push(item);
          break;
        case FacebookDataType.COMMENTS:
          userData.commentsCount++;
          userData.data.comments.push(item);
          break;
        case FacebookDataType.PAGES_LIKED:
          userData.pagesLikedCount++;
          userData.data.pagesLiked.push(item);
          break;
        case FacebookDataType.CHECK_INS:
          userData.checkInsCount++;
          userData.data.checkIns.push(item);
          break;
      }
      
      const date = extractDate(item);
      if (date) {
        if (!userData.lastActive || date > userData.lastActive) {
          userData.lastActive = date;
        }
      }
    });
  });
  
  return Array.from(userMap.values());
}

function extractUID(item: any, type: FacebookDataType): string | null {
  // Try to find UID field based on common patterns
  const uidFields = ['uid', 'user_id', 'id', 'facebook_id', 'fb_id'];
  
  // Look for fields that might contain UID
  for (const field of uidFields) {
    if (item[field]) return String(item[field]);
  }
  
  // If not found in standard fields, try some data-type specific fields
  switch (type) {
    case FacebookDataType.FRIENDS:
      if (item.friend_id) return String(item.friend_id);
      break;
    case FacebookDataType.COMMENTS:
      if (item.commenter_id) return String(item.commenter_id);
      break;
    case FacebookDataType.POSTS:
      if (item.poster_id || item.author_id) {
        return String(item.poster_id || item.author_id);
      }
      break;
  }
  
  // Last resort: look for any field that seems like it might be an ID
  for (const key in item) {
    const keyLower = key.toLowerCase();
    if (keyLower.includes('id') && typeof item[key] === 'string' || typeof item[key] === 'number') {
      return String(item[key]);
    }
  }
  
  return null;
}

function extractName(item: any, type: FacebookDataType): string | undefined {
  // Look for common name fields
  const nameFields = ['name', 'user_name', 'full_name', 'display_name'];
  
  for (const field of nameFields) {
    if (item[field]) return String(item[field]);
  }
  
  // Type-specific name fields
  switch (type) {
    case FacebookDataType.FRIENDS:
      if (item.friend_name) return String(item.friend_name);
      break;
    case FacebookDataType.COMMENTS:
      if (item.commenter_name) return String(item.commenter_name);
      break;
    case FacebookDataType.POSTS:
      if (item.poster_name || item.author_name) {
        return String(item.poster_name || item.author_name);
      }
      break;
  }
  
  return undefined;
}

function extractDate(item: any): Date | undefined {
  // Look for date fields
  const dateFields = ['date', 'timestamp', 'created_at', 'updated_at', 'time'];
  
  for (const field of dateFields) {
    if (item[field]) {
      const parsed = new Date(item[field]);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }
  
  return undefined;
}

export function getStatistics(aggregatedData: AggregatedUserData[]) {
  // Get the total counts across all users
  return aggregatedData.reduce((stats, user) => {
    stats.totalUsers += 1;
    stats.totalFriends += user.friendsCount;
    stats.totalGroups += user.groupsCount;
    stats.totalPosts += user.postsCount;
    stats.totalComments += user.commentsCount;
    stats.totalPagesLiked += user.pagesLikedCount;
    stats.totalCheckIns += user.checkInsCount;
    
    return stats;
  }, {
    totalUsers: 0,
    totalFriends: 0,
    totalGroups: 0,
    totalPosts: 0,
    totalComments: 0,
    totalPagesLiked: 0,
    totalCheckIns: 0
  });
}
