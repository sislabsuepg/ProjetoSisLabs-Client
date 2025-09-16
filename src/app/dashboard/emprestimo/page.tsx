"use client";

import FormEntregaChave from "@/components/FormEntrega/FormEntregaChave";
import FormLabPesquisa from "@/components/FormEntrega/FormLabPesquisa";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { canAccessPage } from "@/utils/permissions";

export default function Entrega() {
  const [activeId, setActiveId] = useState(1);
  const [cookies] = useCookies(["usuario"]);
  const permitido = canAccessPage("emprestimo", cookies);
  if (!permitido) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-theme-text">
          Sem permissão para realizar empréstimos.
        </p>
      </div>
    );
  }

  const listButtons = [
    { id: 1, title: "Entrega de chave", component: <FormEntregaChave /> },
    {
      id: 2,
      title: "Laboratório para pesquisa",
      component: <FormLabPesquisa />,
    },
  ];

  return (
    <div className="w-full flex flex-col h-full items-start">
      <div className="w-full flex items-center justify-center gap-2">
        {listButtons.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item.id === activeId ? "bg-theme-lightBlue" : "bg-theme-blue"
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
