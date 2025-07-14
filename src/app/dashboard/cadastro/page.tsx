'use client';

import { useState } from 'react';

export default function Cadastro() {
  const [activeId, setActiveId] = useState(1);

  const listButtons = [
    {
      id: 1,
      title: 'Acadêmico',
    },
    {
      id: 2,
      title: 'Professor',
    },
    {
      id: 3,
      title: 'Laboratório',
    },
    {
      id: 4,
      title: 'Orientação/Mestrado',
    },
  ];

  return (
    <div className="w-full flex flex-col items-start">
      <div className="w-full flex items-center justify-center gap-2">
        {listButtons?.map((item) => (
          <button
            key={item?.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item?.id === activeId ? 'bg-theme-lightBlue' : 'bg-theme-blue'
            } h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
          >
            {item?.title}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <p className="font-semibold text-[1.2rem] text-theme-blue">
          Cadastro do{' '}
          {listButtons.find((b) => b?.id === activeId)?.title?.toLowerCase() ||
            ''}
        </p>
      </div>
    </div>
  );
}
