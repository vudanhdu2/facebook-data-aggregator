
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { AggregatedUserData } from '@/types';
import { Search, UserCircle } from 'lucide-react';

interface DataDisplayProps {
  aggregatedData: AggregatedUserData[];
}

const DataDisplay: React.FC<DataDisplayProps> = ({ aggregatedData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AggregatedUserData | null>(null);
  
  const filteredData = aggregatedData?.filter(user => {
    const query = searchQuery.toLowerCase();
    return user.uid.toLowerCase().includes(query) || 
           (user.name && user.name.toLowerCase().includes(query));
  }) || [];
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Tìm kiếm theo UID hoặc tên..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User list */}
        <div className="md:col-span-4 space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {filteredData.length > 0 ? (
            filteredData.map(user => (
              <div 
                key={user.uid}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedUser?.uid === user.uid ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
                } shadow-sm border`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    selectedUser?.uid === user.uid ? 'bg-white/20' : 'bg-primary/10'
                  }`}>
                    <UserCircle className={`h-5 w-5 ${
                      selectedUser?.uid === user.uid ? 'text-white' : 'text-primary'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium">{user.name || 'Không có tên'}</h4>
                    <p className={`text-xs ${
                      selectedUser?.uid === user.uid ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      UID: {user.uid}
                    </p>
                  </div>
                </div>
                <div className={`grid grid-cols-3 gap-2 mt-2 text-xs ${
                  selectedUser?.uid === user.uid ? 'text-white/80' : 'text-gray-500'
                }`}>
                  <div>Bạn bè: {user.friendsCount}</div>
                  <div>Nhóm: {user.groupsCount}</div>
                  <div>Bài viết: {user.postsCount}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu người dùng'}
            </div>
          )}
        </div>
        
        {/* User detail */}
        <div className="md:col-span-8 bg-white rounded-lg shadow-sm border p-6">
          {selectedUser ? (
            <div>
              <div className="flex items-center space-x-3 pb-4 border-b mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedUser.name || 'Người dùng'}</h2>
                  <p className="text-sm text-gray-500">UID: {selectedUser.uid}</p>
                  {selectedUser.lastActive && (
                    <p className="text-xs text-gray-500">
                      Hoạt động cuối: {selectedUser.lastActive.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <Tabs defaultValue="summary">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="summary" className="flex-1">Tổng quan</TabsTrigger>
                  <TabsTrigger value="friends" className="flex-1">Bạn bè ({selectedUser.friendsCount})</TabsTrigger>
                  <TabsTrigger value="groups" className="flex-1">Nhóm ({selectedUser.groupsCount})</TabsTrigger>
                  <TabsTrigger value="activities" className="flex-1">Hoạt động</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="data-card">
                      <h3 className="text-sm font-medium text-gray-500">Bạn bè</h3>
                      <p className="text-2xl font-bold">{selectedUser.friendsCount}</p>
                    </div>
                    <div className="data-card">
                      <h3 className="text-sm font-medium text-gray-500">Nhóm đã tham gia</h3>
                      <p className="text-2xl font-bold">{selectedUser.groupsCount}</p>
                    </div>
                    <div className="data-card">
                      <h3 className="text-sm font-medium text-gray-500">Bài đăng</h3>
                      <p className="text-2xl font-bold">{selectedUser.postsCount}</p>
                    </div>
                    <div className="data-card">
                      <h3 className="text-sm font-medium text-gray-500">Bình luận</h3>
                      <p className="text-2xl font-bold">{selectedUser.commentsCount}</p>
                    </div>
                    <div className="data-card">
                      <h3 className="text-sm font-medium text-gray-500">Trang đã thích</h3>
                      <p className="text-2xl font-bold">{selectedUser.pagesLikedCount}</p>
                    </div>
                    <div className="data-card">
                      <h3 className="text-sm font-medium text-gray-500">Check-in</h3>
                      <p className="text-2xl font-bold">{selectedUser.checkInsCount}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="friends">
                  {selectedUser.friendsCount > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {selectedUser.data.friends.map((friend, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          {Object.entries(friend).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-2 text-sm">
                              <span className="font-medium text-gray-600">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">Không có dữ liệu về bạn bè</div>
                  )}
                </TabsContent>
                
                <TabsContent value="groups">
                  {selectedUser.groupsCount > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {selectedUser.data.groups.map((group, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          {Object.entries(group).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-2 text-sm">
                              <span className="font-medium text-gray-600">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">Không có dữ liệu về nhóm</div>
                  )}
                </TabsContent>
                
                <TabsContent value="activities">
                  <Tabs defaultValue="posts">
                    <TabsList className="w-full mb-4 grid grid-cols-3">
                      <TabsTrigger value="posts">Bài đăng ({selectedUser.postsCount})</TabsTrigger>
                      <TabsTrigger value="comments">Bình luận ({selectedUser.commentsCount})</TabsTrigger>
                      <TabsTrigger value="likes">Trang đã thích ({selectedUser.pagesLikedCount})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="posts">
                      {selectedUser.postsCount > 0 ? (
                        <div className="space-y-2 max-h-[350px] overflow-y-auto">
                          {selectedUser.data.posts.map((post, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-md">
                              {Object.entries(post).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2 text-sm">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">Không có dữ liệu bài đăng</div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="comments">
                      {selectedUser.commentsCount > 0 ? (
                        <div className="space-y-2 max-h-[350px] overflow-y-auto">
                          {selectedUser.data.comments.map((comment, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-md">
                              {Object.entries(comment).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2 text-sm">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">Không có dữ liệu bình luận</div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="likes">
                      {selectedUser.pagesLikedCount > 0 ? (
                        <div className="space-y-2 max-h-[350px] overflow-y-auto">
                          {selectedUser.data.pagesLiked.map((page, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-md">
                              {Object.entries(page).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2 text-sm">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">Không có dữ liệu về trang đã thích</div>
                      )}
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-16">
              <UserCircle className="h-16 w-16 mx-auto text-gray-300 mb-2" />
              <h3 className="text-xl font-medium text-gray-500">Chọn một người dùng để xem chi tiết</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;
