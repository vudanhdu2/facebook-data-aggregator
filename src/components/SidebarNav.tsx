
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, History, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  className?: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    },
    {
      name: "Dữ liệu người dùng",
      icon: Users,
      href: "/users",
      active: location.pathname === "/users"
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
    </div>
  );
};

export default SidebarNav;
