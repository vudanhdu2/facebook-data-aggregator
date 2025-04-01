
import { AggregatedUserData, UIDSource } from '../types';
import { searchObjects, processInChunks } from '../lib/dataProcessing';

/**
 * Analyzes user data to generate insights about a specific UID
 * @param userData User data to analyze
 * @returns AI-generated insights about the user
 */
export async function analyzeUserData(userData: AggregatedUserData): Promise<string> {
  try {
    // Generate insights based on user data
    let insights = [];
    
    // Basic user information
    insights.push(`UID: ${userData.uid}`);
    insights.push(`Tên: ${userData.name || 'Không xác định'}`);
    
    // Activity analysis
    if (userData.lastActive) {
      insights.push(`Hoạt động cuối: ${userData.lastActive.toLocaleDateString()}`);
    }
    
    // Data source analysis
    insights.push(`Số lượng nguồn dữ liệu: ${userData.sources.length}`);
    const sourceTypes = new Set(userData.sources.map(s => s.fileType));
    insights.push(`Loại dữ liệu: ${Array.from(sourceTypes).join(', ')}`);
    
    // Social graph analysis
    if (userData.friendsCount > 0) {
      insights.push(`Có ${userData.friendsCount} bạn bè`);
    }
    
    if (userData.groupsCount > 0) {
      insights.push(`Tham gia ${userData.groupsCount} nhóm`);
    }
    
    // Content analysis
    if (userData.postsCount > 0) {
      insights.push(`Đã đăng ${userData.postsCount} bài viết`);
    }
    
    if (userData.commentsCount > 0) {
      insights.push(`Đã bình luận ${userData.commentsCount} lần`);
    }
    
    // Location analysis
    if (userData.checkInsCount > 0) {
      insights.push(`Đã check-in tại ${userData.checkInsCount} địa điểm`);
    }
    
    // Page interest analysis
    if (userData.pagesLikedCount > 0) {
      insights.push(`Đã thích ${userData.pagesLikedCount} trang`);
    }
    
    return insights.join('\n');
  } catch (error) {
    console.error("Error analyzing user data:", error);
    return "Không thể phân tích dữ liệu. Xảy ra lỗi trong quá trình xử lý.";
  }
}

/**
 * Finds connections between UIDs based on shared properties or interactions
 * @param userData Array of user data to analyze
 * @returns Object with connection information
 */
export async function findConnections(userData: AggregatedUserData[]): Promise<{ 
  connections: Array<{ source: string, target: string, strength: number, type: string }>,
  insights: string
}> {
  // Process connections in chunks to avoid UI freezing
  const connections: Array<{ source: string, target: string, strength: number, type: string }> = [];
  
  // Process each pair of users to find connections
  await processInChunks(userData, (user1, index) => {
    userData.slice(index + 1).forEach(user2 => {
      let connectionStrength = 0;
      const connectionTypes: string[] = [];
      
      // Check for connections in friends lists
      if (user1.data.friends.some(friend => 
        typeof friend.uid === 'string' && friend.uid === user2.uid)) {
        connectionStrength += 10;
        connectionTypes.push('friend');
      }
      
      // Check for shared groups
      const user1Groups = new Set(user1.data.groups.map(g => g.group_id || g.id));
      const sharedGroups = user2.data.groups.filter(g => 
        user1Groups.has(g.group_id || g.id)
      );
      
      if (sharedGroups.length > 0) {
        connectionStrength += sharedGroups.length * 2;
        connectionTypes.push(`${sharedGroups.length} shared groups`);
      }
      
      // If we found any connections, add to results
      if (connectionStrength > 0) {
        connections.push({
          source: user1.uid,
          target: user2.uid,
          strength: connectionStrength,
          type: connectionTypes.join(', ')
        });
      }
    });
    return null; // Returning null as we're building connections array directly
  });
  
  // Generate insights text
  let insights = '';
  if (connections.length > 0) {
    insights = `Phân tích mạng lưới: Tìm thấy ${connections.length} kết nối giữa các người dùng.`;
  } else {
    insights = 'Không tìm thấy kết nối giữa các người dùng.';
  }
  
  return { connections, insights };
}

/**
 * Categorize user interests based on pages liked, groups joined, etc.
 * @param userData User data to analyze
 * @returns Object with categorized interests
 */
export async function categorizeUserInterests(userData: AggregatedUserData): Promise<{
  categories: Record<string, number>,
  topInterests: string[]
}> {
  const categories: Record<string, number> = {};
  
  // Analyze pages liked
  userData.data.pagesLiked.forEach(page => {
    const category = page.category || 'Khác';
    categories[category] = (categories[category] || 0) + 1;
  });
  
  // Analyze groups joined
  userData.data.groups.forEach(group => {
    if (group.name) {
      // Try to extract category from group name - simple heuristic
      const possibleCategories = [
        'Thể thao', 'Du lịch', 'Công nghệ', 'Giáo dục', 'Giải trí',
        'Ẩm thực', 'Thời trang', 'Sức khỏe', 'Kinh doanh', 'Nghệ thuật'
      ];
      
      const foundCategory = possibleCategories.find(cat => 
        group.name.toLowerCase().includes(cat.toLowerCase())
      );
      
      if (foundCategory) {
        categories[foundCategory] = (categories[foundCategory] || 0) + 1;
      } else {
        categories['Khác'] = (categories['Khác'] || 0) + 1;
      }
    }
  });
  
  // Sort categories by count
  const sortedCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return {
    categories,
    topInterests: sortedCategories.slice(0, 5)
  };
}

/**
 * Main function to generate comprehensive AI analysis for a user
 * @param userData User data to analyze
 * @returns Comprehensive analysis text
 */
export async function generateAIAnalysis(userData: AggregatedUserData): Promise<string> {
  try {
    // Generate basic insights
    const basicInsights = await analyzeUserData(userData);
    
    // Categorize user interests
    const { topInterests } = await categorizeUserInterests(userData);
    
    // Combine all insights
    let fullAnalysis = `# Phân tích UID: ${userData.uid}\n\n`;
    fullAnalysis += `## Thông tin cơ bản\n${basicInsights}\n\n`;
    
    if (topInterests.length > 0) {
      fullAnalysis += `## Sở thích chính\n${topInterests.join(', ')}\n\n`;
    }
    
    // Add activity patterns if we have enough data
    if (userData.postsCount > 0 || userData.commentsCount > 0) {
      fullAnalysis += `## Mẫu hoạt động\n`;
      fullAnalysis += `Tổng số hoạt động: ${userData.postsCount + userData.commentsCount}\n`;
    }
    
    // Check for missing data
    const missingDataTypes = [];
    if (userData.friendsCount === 0) missingDataTypes.push('bạn bè');
    if (userData.groupsCount === 0) missingDataTypes.push('nhóm');
    if (userData.postsCount === 0) missingDataTypes.push('bài đăng');
    if (userData.commentsCount === 0) missingDataTypes.push('bình luận');
    
    if (missingDataTypes.length > 0) {
      fullAnalysis += `\n## Dữ liệu còn thiếu\nCần bổ sung thêm dữ liệu về: ${missingDataTypes.join(', ')}\n`;
    }
    
    return fullAnalysis;
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    return "Không thể tạo phân tích. Xảy ra lỗi trong quá trình xử lý.";
  }
}
