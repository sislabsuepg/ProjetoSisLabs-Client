'use client';

import Pagination from '@/components/Pagination';
import { useState } from 'react';

export default function Inicio() {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const listaTeste = [
    {
      id: 1,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 2,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 3,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 4,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 5,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 6,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 7,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 8,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 9,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 10,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 11,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 12,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 13,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 14,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
    {
      id: 15,
      lab: '108A',
      usuario: 'Raissa Mayara Moreira',
      horario: '17:40',
    },
  ];

  const totalPages = Math.ceil(listaTeste.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = listaTeste.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full flex flex-col h-full items-start">
      <p className="text-theme-blue font-semibold text-[1.2rem] w-full text-start">
        Laboratórios em uso
      </p>

      <div className="w-full flex flex-col justify-between h-full gap-2 mt-5">
        {currentItems?.map((item) => (
          <div
            key={item?.id}
            className={`w-full flex items-center gap-2 ${
              Number(item?.id) % 2 == 0 ? 'bg-transparent' : 'bg-[#F3F3F3]'
            } h-12 py-2 px-4 rounded-[10px]`}
          >
            <div className="h-2 w-2 bg-[#22FF00] rounded-full"></div>
            <p>
              Laboratório <span className="font-semibold">{item?.lab}</span> -
              Chave do Laboratório {item?.lab} foi emprestado pelo(a) aluno(a){' '}
              <span className="font-semibold">{item?.usuario}</span> -{' '}
              {item?.horario}
            </p>
          </div>
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
