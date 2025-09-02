'use client';

import FormAcademicoRelatorio from '@/components/FormRelatorio/FormAcademicoRelatorio';
import FormCursoRelatorio from '@/components/FormRelatorio/FormCursoRelatorio';
import FormLaboratorioRelatorio from '@/components/FormRelatorio/FormLaboratorioRelatorio';
import { useState } from 'react';

export default function Relatorios() {
    const [activeId, setActiveId] = useState(1);
  
    const listButtons = [
      { id: 1, title: 'Laboratório', component: <FormLaboratorioRelatorio /> },
      { id: 2, title: 'Acadêmico', component: <FormAcademicoRelatorio /> },
      { id: 3, title: 'Acadêmico por curso', component: <FormCursoRelatorio /> },
    ];

  return (
    <div className="h-full w-full flex flex-col items-start">
      <div className="w-full flex items-center justify-center gap-2">
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
