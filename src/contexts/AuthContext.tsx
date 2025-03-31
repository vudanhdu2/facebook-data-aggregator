
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isMember: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from a database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
    createdAt: new Date()
  },
  {
    id: '2',
    email: 'member@example.com',
    name: 'Member User',
    role: UserRole.MEMBER,
    createdAt: new Date()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Restore Date object
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email (in a real app, would also check password)
      const matchedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (matchedUser) {
        setUser(matchedUser);
        localStorage.setItem('currentUser', JSON.stringify(matchedUser));
        toast({
          title: "Đăng nhập thành công",
          description: `Chào mừng ${matchedUser.name || matchedUser.email}!`
        });
        return true;
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Email hoặc mật khẩu không đúng",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Lỗi đăng nhập",
        description: "Có lỗi xảy ra trong quá trình đăng nhập",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Đã đăng xuất",
      description: "Bạn đã đăng xuất khỏi hệ thống"
    });
  };

  const isAdmin = () => {
    return user?.role === UserRole.ADMIN;
  };

  const isMember = () => {
    return user?.role === UserRole.MEMBER;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin, isMember }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
