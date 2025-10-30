"use client";

import FormEntregaChave from "@/components/FormEntrega/FormEntregaChave";
import FormLabPesquisa from "@/components/FormEntrega/FormLabPesquisa";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { canAccessPage } from "@/utils/permissions";
import { useGuidedTour } from "@/components/GuidedTour/TourContext";

export default function Entrega() {
  const [activeId, setActiveId] = useState(1);
  const sectionMap: Record<number, string> = { 1: "chave", 2: "pesquisa" };
  const activeSection = sectionMap[activeId];
  const [cookies] = useCookies(["usuario"]);
  const permitido = canAccessPage("emprestimo", cookies);
  const { setActiveSection: setTourSection } = useGuidedTour();

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
    { id: 1, title: "Entrega de chave", component: <FormEntregaChave />, extendClass: "EntregaChave-button" },
    {
      id: 2,
      title: "Laboratório para pesquisa",
      component: <FormLabPesquisa />, extendClass: "LabPesquisa-button"
    },
  ];


  // Atualiza a seção ativa no contexto sempre que muda o botão
  useEffect(() => {
    setTourSection(activeSection);
  }, [activeSection, setTourSection]);

  return (
    <div className="w-full flex flex-col h-full items-start">
      <div className="w-full flex items-center justify-center gap-2">
        {listButtons.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`${item.id === activeId ? "bg-theme-lightBlue" : "bg-theme-blue"
              } ${item.extendClass} h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="h-full mt-10 w-full" data-tour-section={activeSection}>
        {listButtons.map((item) => (
          <div
            key={item.id}
            style={{ display: item.id === activeId ? "block" : "none" }}
          >
            {item.component}
          </div>
        ))}
      </div>
    </div>
  );
}
