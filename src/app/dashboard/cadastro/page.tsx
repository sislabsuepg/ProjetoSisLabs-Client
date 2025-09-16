"use client";

import FormAcademico from "@/components/Form/FormAcademico";
import FormCurso from "@/components/Form/FormCurso";
import FormLaboratorio from "@/components/Form/FormLaboratorio";
import FormOrientacao from "@/components/Form/FormOrientacao";
import FormPermissao from "@/components/Form/FormPermissao";
import FormProfessor from "@/components/Form/FormProfessor";
import FormUsuario from "@/components/Form/FormUsuario";
import { useState, useMemo } from "react";
import { useCookies } from "react-cookie";
import { getUserPermissions } from "@/utils/permissions";

export default function Cadastro() {
  const [activeId, setActiveId] = useState(1);
  const [cookies] = useCookies(["usuario"]);
  const perms = getUserPermissions(cookies);
  const podeGeral = perms.geral === true;
  const podeCadastro = perms.cadastro === true || podeGeral;

  // Regras: geral pode cadastrar usuarios, permissoes, cursos, professores e laboratorios.
  // cadastro cobre os demais não inclusos (ex: orientação?)
  const allButtons = [
    {
      id: 1,
      title: "Acadêmico",
      component: <FormAcademico />,
      need: "cadastro",
    },
    { id: 2, title: "Professor", component: <FormProfessor />, need: "geral" },
    {
      id: 3,
      title: "Laboratório",
      component: <FormLaboratorio />,
      need: "geral",
    },
    { id: 4, title: "Curso", component: <FormCurso />, need: "geral" },
    {
      id: 5,
      title: "Orientação",
      component: <FormOrientacao />,
      need: "cadastro",
    },
    { id: 6, title: "Permissão", component: <FormPermissao />, need: "geral" },
    { id: 7, title: "Usuário", component: <FormUsuario />, need: "geral" },
  ] as const;

  const listButtons = useMemo(
    () =>
      allButtons.filter((b) => (b.need === "geral" ? podeGeral : podeCadastro)),
    [podeGeral, podeCadastro]
  );

  // Garantir activeId válido após filtragem
  const active = useMemo(() => {
    if (!listButtons.some((b) => b.id === activeId)) {
      return listButtons[0]?.id || 0;
    }
    return activeId;
  }, [activeId, listButtons]);

  return (
    <div className="h-full w-full flex flex-col items-start">
      <div className="w-full flex items-center justify-center gap-2 flex-wrap">
        {listButtons.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item.id === active ? "bg-theme-lightBlue" : "bg-theme-blue"
            } h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="h-full mt-10 w-full">
        {listButtons.find((b) => b.id === active)?.component || (
          <p className="text-theme-text text-sm">
            Sem permissão para cadastros.
          </p>
        )}
      </div>
    </div>
  );
}
