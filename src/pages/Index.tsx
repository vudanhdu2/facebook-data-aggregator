
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import SidebarNav from '../components/SidebarNav';

const Index = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Check if the current route is a direct UID route or a user detail page
  const isUserDetailPage = (
    // Match /users/:uid pattern
    path.includes('/users/') && 
    path !== '/users' && 
    path !== '/users/profile' && 
    path !== '/users/group' && 
    path !== '/users/page'
  ) || (
    // Match direct /:uid pattern (except for known routes)
    path.length > 1 && 
    !path.includes('/') && 
    path !== '/upload' && 
    path !== '/history' && 
    path !== '/stats' && 
    path !== '/admin' && 
    path !== '/login' && 
    path !== '/register'
  );
  
  // Show sidebar on all pages except user detail pages
  const showSidebar = !isUserDetailPage;

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
