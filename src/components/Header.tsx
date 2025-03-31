
import React from 'react';
import { Database } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6" />
          <h1 className="text-xl font-bold">Facebook Data Aggregator</h1>
        </div>
        <div>
          <p className="text-sm opacity-80">Tổng hợp và phân tích dữ liệu Facebook</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
