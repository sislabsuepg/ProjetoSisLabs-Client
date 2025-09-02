'use client';
import Sidebar from '@/components/SideBarMenu';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [cookies] = useCookies(['usuario']);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const user = cookies.usuario;
      if (!user || !user.id || !user.nome || user.id <= 0) {
        console.log('Usuário não autenticado, redirecionando para login');
        router.push('/login');
      }
    }
  }, [mounted, cookies.usuario, router]);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex-col gap-2 flex items-center justify-center">
        <p className='font-normal'>Carregando...</p>
        <CircularProgress size={40} />
      </div>
    );
  }

  const user = cookies.usuario;
  if (!user || !user.id || !user.nome || user.id <= 0) {
    return (
      <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
        <p className='font-normal'>Redirecionando...</p>
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="w-full flex items-start">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <section
        className={`transition-all duration-500 flex-1 m-5 border-4 p-5 border-[#F3F3F3] rounded-[20px] box-border ${isOpen ? 'ml-0 md:ml-[400px]' : 'ml-0 md:ml-[60px]'
          }`}
        style={{ height: 'calc(100vh - 2.5rem)' }}
      >
        {children}
      </section>
    </div>
  );
}
