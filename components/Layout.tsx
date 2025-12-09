import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-full min-h-screen bg-gray-100 flex justify-center shadow-2xl overflow-hidden">
      <div className="w-full max-w-md bg-white h-full relative overflow-y-auto no-scrollbar flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default Layout;