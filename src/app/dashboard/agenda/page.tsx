"use client";

import AdicionarRecados from "@/components/Agenda/AdicionarRecados";
import AdicionarEventos from "@/components/Agenda/AdicionarEventos";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { canAccessPage } from "@/utils/permissions";

export default function Cronograma() {
  const [activeId, setActiveId] = useState(1);
  const [cookies] = useCookies(["usuario"]);
  const permitido = canAccessPage("agenda", cookies);

  if (!permitido) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-theme-text">
          Sem permissão para adicionar eventos e recados.
        </p>
      </div>
    );
  }

  const listButtons = [
    {
      id: 1,
      title: "Adicionar eventos",
      component: <AdicionarEventos />,
      extendClass: "add-evento-button",
    },
    {
      id: 2,
      title: "Adicionar recados",
      component: <AdicionarRecados />,
      extendClass: "add-recado-button",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full flex items-center justify-center gap-2 mb-4">
        {listButtons.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item.id === activeId ? "bg-theme-lightBlue" : "bg-theme-blue"
            } ${item.extendClass} h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="h-full mt-10 w-full">
        {listButtons.find((b) => b.id === activeId)?.component}
      </div>
    </div>
  );
}
