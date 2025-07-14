'use client';
import Sidebar from '@/components/SideBarMenu';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full flex items-start">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <section
        className={`transition-all duration-500 m-5 border-4 p-5 border-[#F3F3F3] min-h-screen rounded-[20px] flex-1 ${
          isOpen ? 'ml-0 md:ml-[400px]' : 'ml-0 md:ml-[60px]'
        }`}
      >
        {children}
      </section>
    </div>
  );
}
