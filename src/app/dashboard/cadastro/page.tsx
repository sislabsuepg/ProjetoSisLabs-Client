"use client";

import FormAcademico from "@/components/Form/FormAcademico";
import FormCurso from "@/components/Form/FormCurso";
import FormLaboratorio from "@/components/Form/FormLaboratorio";
import FormOrientacao from "@/components/Form/FormOrientacao";
import FormPermissao from "@/components/Form/FormPermissao";
import FormProfessor from "@/components/Form/FormProfessor";
import FormUsuario from "@/components/Form/FormUsuario";
import { useState } from "react";

export default function Cadastro() {
  const [activeId, setActiveId] = useState(1);

  const listButtons = [
    { id: 1, title: "Acadêmico", component: <FormAcademico /> },
    { id: 2, title: "Professor", component: <FormProfessor /> },
    { id: 3, title: "Laboratório", component: <FormLaboratorio /> },
    { id: 4, title: "Curso", component: <FormCurso /> },
    { id: 5, title: "Orientação", component: <FormOrientacao /> },
    { id: 6, title: "Permissão", component: <FormPermissao /> },
    { id: 7, title: "Usuário", component: <FormUsuario /> },
  ];

  return (
    <div className="h-full w-full flex flex-col items-start">
      <div className="w-full flex items-center justify-center gap-2 flex-wrap">
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
