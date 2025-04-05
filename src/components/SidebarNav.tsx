
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, History, Users, ChevronDown, ChevronUp, User, Folder, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  className?: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usersExpanded, setUsersExpanded] = useState(
    location.pathname.includes('/users/')
  );
  
  const toggleUsersExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUsersExpanded(!usersExpanded);
  };
  
  const items = [
    {
      name: "Tải lên",
      icon: Upload,
      href: "/upload",
      active: location.pathname === "/upload" || location.pathname === "/"
    },
    {
      name: "Lịch sử tải",
      icon: History,
      href: "/history",
      active: location.pathname === "/history"
    }
  ];
  
  const userSubItems = [
    {
      name: "UID PROFILE",
      icon: User,
      href: "/users/profile",
      active: location.pathname === "/users/profile",
      description: "Thông tin hồ sơ người dùng"
    },
    {
      name: "UID GROUP",
      icon: Folder,
      href: "/users/group",
      active: location.pathname === "/users/group",
      description: "Dữ liệu nhóm người dùng"
    },
    {
      name: "UID PAGE",
      icon: FileText,
      href: "/users/page",
      active: location.pathname === "/users/page",
      description: "Dữ liệu trang người dùng"
    }
  ];

  return (
    <div className={cn("flex flex-col space-y-1 bg-primary/10 p-2 h-full", className)}>
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => navigate(item.href)}
          className={cn(
            "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all hover:bg-primary/10",
            item.active ? "bg-primary text-white" : "text-primary hover:text-primary-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
        </button>
      ))}
      
      <div className="relative">
        <button
          onClick={(e) => {
            !usersExpanded && navigate("/users");
            toggleUsersExpanded(e);
          }}
          className={cn(
            "w-full flex items-center justify-between gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all hover:bg-primary/10",
            (location.pathname === "/users" || location.pathname.includes("/users/")) 
              ? "bg-primary text-white" 
              : "text-primary hover:text-primary-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5" />
            <span>Dữ liệu người dùng</span>
          </div>
          {usersExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {usersExpanded && (
          <div className="pl-4 mt-1 space-y-1">
            {userSubItems.map((subItem) => (
              <button
                key={subItem.name}
                onClick={() => navigate(subItem.href)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-all hover:bg-primary/10",
                  subItem.active ? "bg-primary/80 text-white" : "text-primary hover:text-primary-foreground"
                )}
              >
                <subItem.icon className="h-4 w-4" />
                <span>{subItem.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarNav;
