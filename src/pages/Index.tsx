
import React from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import SidebarNav from '../components/SidebarNav';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-white shadow-sm hidden md:block">
          <SidebarNav />
        </aside>
        <main className="flex-1">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Index;
