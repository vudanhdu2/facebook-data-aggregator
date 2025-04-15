
import { FacebookData, FacebookDataType, AggregatedUserData, UploadedFile, UIDSource, DataSourceType } from '../types';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { formatFileSize } from './funcHelper';

export async function readExcelFile(file: File): Promise<UploadedFile | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const dataExcel = handleFormatDataSheet(worksheet).filter(row => row[0].length > 0);
        
        if (dataExcel.length > 0) {
          dataExcel.shift(); // Remove header row
        }
        console.log("Parsed data:", dataExcel);
        resolve({
          id: uuidv4(), // Add a unique ID
          name: file.name,
          type: FacebookDataType.UNKNOWN, // Default type, will be overridden
          data: dataExcel,
          rowCount: dataExcel.length,
          processed: false,
          manualType: false,
          size: file.size,
          uploadDate: new Date(), // Add current timestamp
          sourceType: DataSourceType.UID_PROFILE, // Default source type, will be overridden if specified
          uploaderId: 0 // Default uploader ID, will be overridden
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

const handleFormatDataSheet = (ws) => {
  let range = XLSX.utils.decode_range(ws['!ref']);
  const rows = [];

  for (let R = range.s.r; R <= range.e.r; ++R) {
    const row = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      const cell = ws[cell_ref];

      if (cell) {
        if (cell.t === 'n' && cell.z && cell.z.toLowerCase().includes("yy")) {
          row.push(XLSX.SSF.format("yyyy-mm-dd hh:mm:ss", cell.v));
        } else {
          row.push(cell.v);
        }
      } else {
        row.push("");
      }
    }
    rows.push(row);
  }
  return rows;
}

export const formatUID = (dataRows: string[][], uidIndex: number) => {
  const parsed: string[][] = [];

  for (const row of dataRows) {
    if (!row || row.length <= uidIndex) continue;

    const rawUid = row[uidIndex]?.trim();
    if (!rawUid) continue;

    const parts = rawUid.split('.');
    if (parts.length < 2) continue;

    const uid = parts.slice(1).join('.').trim(); // lấy phần sau dấu chấm
    if (!uid) continue;

    row[uidIndex] = uid;
    parsed.push(row);
  }

  return parsed;
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
          sources: [], // Initialize empty sources array
          data: {
            friends: [],
            groups: [],
            posts: [],
            comments: [],
            pagesLiked: [],
            checkIns: [],
            events: [],      // Added missing events array
            interactions: [] // Added missing interactions array
          }
        });
      }
      
      const userData = userMap.get(uid)!;
      
      // Add source to the user's sources list if it doesn't already exist
      const source: UIDSource = {
        fileName: file.name,
        fileType: file.type,
        timestamp: file.uploadDate,
        sourceType: file.sourceType, // Include the source type
        sourceUID: file.sourceUID // Include the source UID if available
      };
      
      // Check if this source already exists to avoid duplicates
      const sourceExists = userData.sources.some(
        s => s.fileName === source.fileName && s.fileType === source.fileType
      );
      
      if (!sourceExists) {
        userData.sources.push(source);
      }
      
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
    stats.totalSources += user.sources.length;
    
    return stats;
  }, {
    totalUsers: 0,
    totalFriends: 0,
    totalGroups: 0,
    totalPosts: 0,
    totalComments: 0,
    totalPagesLiked: 0,
    totalCheckIns: 0,
    totalSources: 0
  });
}

// New function to get unique sources for all UIDs
export function getAllSourcesFromData(aggregatedData: AggregatedUserData[]): UIDSource[] {
  const uniqueSources = new Map<string, UIDSource>();
  
  aggregatedData.forEach(user => {
    user.sources.forEach(source => {
      // Include the sourceType in the key to properly track different source types
      const key = `${source.fileName}-${source.fileType}-${source.sourceType || ''}`;
      if (!uniqueSources.has(key)) {
        uniqueSources.set(key, source);
      }
    });
  });
  
  return Array.from(uniqueSources.values());
}
