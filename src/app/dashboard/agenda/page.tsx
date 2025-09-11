"use client";

import AdicionarRecados from "@/components/Agenda/AdicionarRecados";
import AdicionarEventos from "@/components/Agenda/AdicionarEventos";
import EventosAvisos from "@/components/Agenda/EventosAvisos";
import { useState } from "react";

export default function Cronograma() {
  const [activeId, setActiveId] = useState(1);

  const listButtons = [
    { id: 1, title: 'Eventos e Avisos', component: <EventosAvisos /> },
    { id: 2, title: 'Adicionar eventos', component: <AdicionarEventos /> },
    { id: 3, title: 'Adicionar recados', component: <AdicionarRecados /> },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full flex items-center justify-center gap-2 mb-4">
        {listButtons.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item.id === activeId ? 'bg-theme-lightBlue' : 'bg-theme-blue'
            } h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
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
