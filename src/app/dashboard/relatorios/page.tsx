"use client";

import FormAcademicoRelatorio from "@/components/FormRelatorio/FormAcademicoRelatorio";
import FormCursoRelatorio from "@/components/FormRelatorio/FormCursoRelatorio";
import FormLaboratorioRelatorio from "@/components/FormRelatorio/FormLaboratorioRelatorio";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { canAccessPage } from "@/utils/permissions";
import { useGuidedTour } from "@/components/GuidedTour/TourContext";

export default function Relatorios() {
  const [activeId, setActiveId] = useState(1);
  const sectionMap: Record<number, string> = { 
  1: "laboratorio", 
  2: "academico", 
  3: "curso" 
};
  const activeSection = sectionMap[activeId];
  const [cookies] = useCookies(["usuario"]);
  const permitido = canAccessPage("relatorios", cookies);
  const { setActiveSection: setTourSection } = useGuidedTour();
    
  if (!permitido) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-theme-text">
          Sem permissão para gerar relatórios.
        </p>
      </div>
    );
  }

  const listButtons = [
    { id: 1, title: "Laboratório", component: <FormLaboratorioRelatorio />, extendClass: 'lab-relatorio-button' },
    { id: 2, title: "Acadêmico", component: <FormAcademicoRelatorio />, extendClass: 'academico-relatorio-button' },
    { id: 3, title: "Acadêmico por curso", component: <FormCursoRelatorio />, extendClass: 'curso-relatorio-button' },
  ];

  useEffect(() => {
    setTourSection(activeSection);
  }, [activeSection, setTourSection]);

  return (
    <div className="h-full w-full flex flex-col items-start">
      <div className="w-full flex items-center justify-center gap-2">
        {listButtons.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item.id === activeId ? "bg-theme-lightBlue" : "bg-theme-blue"
            } ${item?.extendClass} h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="h-full mt-10 w-full" data-tour-section={activeSection}>
        {listButtons.find((b) => b.id === activeId)?.component}
      </div>
    </div>
  );
}
