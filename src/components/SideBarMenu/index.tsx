'use client';
import { data_images } from '@/assets/data';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface SidebarItemProps {
  icon: string;
  text: string;
  active?: boolean;
  onClick?: () => void;
  isOpen?: boolean;
}

function SidebarItem({
  icon,
  text,
  active,
  onClick,
  isOpen,
}: SidebarItemProps) {
  return (
    <li
      className={`relative flex items-center p-3 my-2 cursor-pointer
        rounded-[10px] transition-colors duration-200
        ${active ? 'bg-theme-blue text-theme-white' : 'bg-[#4F6B98]'}
      `}
      onClick={onClick}
    >
      <div className={`mr-4 text-theme-white`}>
        <img className="w-full max-w-[20px]" src={icon} alt="Menu" />
      </div>
      <span className="text-[1rem] font-medium text-theme-white">{text}</span>
      {active && isOpen && (
        <div
          className="absolute -right-7 top-1/2 -translate-y-1/2 w-0 h-0
                        border-t-[15px] border-b-[15px] border-l-[15px]
                        border-t-transparent border-b-transparent border-theme-blue"
        />
      )}
    </li>
  );
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('Início');
  const router = useRouter();

  return (
    <>
      {!isOpen && (
        <button
          className="h-[45px] w-[45px] flex items-center justify-center cursor-pointer rounded-r-[5px] p-2 bg-theme-blue text-theme-white/80 hover:text-theme-white transition duration-300 fixed top-4 left-0 z-50"
          onClick={() => setIsOpen(true)}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
        </button>
      )}

      <aside
        className={`h-screen bg-theme-blue flex flex-col p-4 shadow-lg transition-transform duration-500 z-50
            fixed left-0 top-0
            ${
              isOpen ? 'translate-x-0 w-[380px]' : '-translate-x-full w-[380px]'
            }
          `}
      >
        <div className="flex items-center justify-between gap-2 px-2 py-4 border-b border-theme-blue/70">
          <div className="flex items-center gap-2">
            <div className="p-2 border-4 border-[#4F6B98] rounded-full bg-theme-white">
              <PersonIcon sx={{ fontSize: 40 }} className="text-theme-blue" />
            </div>
            <div className="flex flex-col text-theme-white">
              <span className="font-semibold text-lg text-theme-lightBlue leading-4">
                João Ribeiro dos Santos
              </span>
              <span className="text-sm font-semibold text-[#6481B0]">
                Administrador Geral
              </span>
            </div>
          </div>
          <button
            className={`h-[40px] w-[40px] flex items-center justify-center cursor-pointer rounded-full p-2 hover:bg-[#6481B0] text-theme-white/80 hover:text-theme-white transition-transform duration-300`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <ul className="flex-grow">
          <SidebarItem
            icon={data_images?.icon_inicio}
            text="Início"
            active={activeItem === 'Início'}
            onClick={() => {
              setActiveItem('Início');
              router.push('/dashboard/');
            }}
            isOpen={isOpen}
          />
          <SidebarItem
            icon={data_images?.icon_cadastro}
            text="Cadastro"
            active={activeItem === 'Cadastro'}
            onClick={() => {
              setActiveItem('Cadastro');
              router.push('/dashboard/cadastro');
            }}
            isOpen={isOpen}
          />
          <SidebarItem
            icon={data_images?.icon_alterar_excluir}
            text="Alterar ou excluir"
            active={activeItem === 'Alterar ou excluir'}
            onClick={() => {
              setActiveItem('Alterar ou excluir');
              router.push('/dashboard/alterar');
            }}
            isOpen={isOpen}
          />
          <SidebarItem
            icon={data_images?.icon_relatorio}
            text="Relatórios"
            active={activeItem === 'Relatórios'}
            onClick={() => {
              setActiveItem('Relatórios');
              router.push('/dashboard/relatorios');
            }}
            isOpen={isOpen}
          />
          <SidebarItem
            icon={data_images?.icon_advertencia}
            text="Emitir advertência"
            active={activeItem === 'Emitir advertência'}
            onClick={() => {
              setActiveItem('Emitir advertência');
              router.push('/dashboard/advertencia');
            }}
            isOpen={isOpen}
          />
          <SidebarItem
            icon={data_images?.icon_chave}
            text="Entrega de chave"
            active={activeItem === 'Entrega de chave'}
            onClick={() => {
              setActiveItem('Entrega de chave');
              router.push('/dashboard/entrega');
            }}
            isOpen={isOpen}
          />
          <SidebarItem
            icon={data_images?.icon_pesquisa}
            text="Laboratório para pesquisa"
            active={activeItem === 'Laboratório para pesquisa'}
            onClick={() => {
              setActiveItem('Laboratório para pesquisa');
              router.push('/dashboard/pesquisa');
            }}
            isOpen={isOpen}
          />
          <SidebarItem
            icon={data_images?.icon_aulas}
            text="Programação das aulas"
            active={activeItem === 'Programação das aulas'}
            onClick={() => {
              setActiveItem('Programação das aulas');
              router.push('/dashboard/aulas');
            }}
            isOpen={isOpen}
          />
        </ul>

        <div className="mt-auto pt-4">
          <div className="flex justify-center">
            <img
              className="w-full max-w-[150px]"
              src={data_images?.logo_uepg_desktop_white}
              alt="Logo UEPG"
            />
          </div>
          <SidebarItem
            icon={data_images?.icon_sair}
            text="Sair"
            //   onClick={}
            isOpen={isOpen}
          />
        </div>
      </aside>
    </>
  );
}
