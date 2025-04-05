
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import SidebarNav from '../components/SidebarNav';

const Index = () => {
  const location = useLocation();
  const showSidebar = !location.pathname.includes('/users/') || 
                       location.pathname === '/users' ||
                       location.pathname === '/users/profile' ||
                       location.pathname === '/users/group' ||
                       location.pathname === '/users/page';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        {showSidebar && (
          <aside className="w-64 border-r bg-white shadow-sm hidden md:block">
            <SidebarNav />
          </aside>
        )}
        <main className="flex-1">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Index;
