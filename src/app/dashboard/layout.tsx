"use client";
import ModalNotification from "@/components/ModalNotifications";
import Sidebar from "@/components/SideBarMenu";
import { useNotificationStore } from "@/store";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from "@mui/material/Badge";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [cookies] = useCookies(["usuario", "aluno"]);
  const notificationCount = useNotificationStore((state) => state.count);
  const [openModalNotification, setOpenModalNotification] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const user = cookies.usuario;
      const aluno = cookies.aluno;
      if (!user || !user.id || !user.nome || user.id <= 0 || aluno) {
        console.log("Usuário não autenticado, redirecionando para login");
        router.push("/login");
      }
    }
  }, [mounted, cookies.usuario, router]);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex-col gap-2 flex items-center justify-center">
        <p className="font-normal">Carregando...</p>
        <CircularProgress size={40} />
      </div>
    );
  }

  const user = cookies.usuario;
  if (!user || !user.id || !user.nome || user.id <= 0) {
    return (
      <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
        <p className="font-normal">Redirecionando...</p>
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="w-full flex items-start">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <section
        className={`transition-all duration-500 flex-1 min-h-screen md:min-h-[calc(100vh-2.5rem)] m-5 border-4 p-5 border-[#F3F3F3] rounded-[20px] box-border overflow-x-auto overflow-y-auto ${isOpen ? "ml-0 md:ml-[400px]" : "ml-5 md:ml-[60px]"
          }`}
      >
        {children}

        <div className="fixed top-5 right-5 group w-fit">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-theme-blue text-theme-white font-normal text-sm px-2 py-1 rounded shadow-md whitespace-nowrap">
            Recados e Eventos
          </span>

          <Badge
            badgeContent={notificationCount}
            color="error"
            invisible={notificationCount === 0}
          >
            <NotificationsIcon
              sx={{ fontSize: 40 }}
              className="cursor-pointer text-theme-lightBlue"
              onClick={() => {
                setOpenModalNotification(true);
              }}
            />
          </Badge>
        </div>

        {openModalNotification && (
          <ModalNotification
            open={openModalNotification}
            setOpen={setOpenModalNotification}
          />
        )}
      </section>
    </div>
  );
}
