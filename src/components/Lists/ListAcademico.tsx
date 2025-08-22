'use client';

import Popover from '@/components/Popover';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { FormAcademico } from './types';

interface Props {
  list: FormAcademico[];
  dados: FormAcademico[];
  setFormData: (data: FormAcademico) => void;
  setOpenEditUser: (state: { status: boolean; id: string }) => void;
  setOpenExcluir: (state: { status: boolean; id: string }) => void;
}

export default function ListAcademico({
  list,
  dados,
  setFormData,
  setOpenEditUser,
  setOpenExcluir,
}: Props) {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="h-full overflow-y-auto rounded-lg bg-theme-white mt-5">
        <table className="h-full min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                RA
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                Telefone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                E-mail
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                Curso
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                Ano
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                Editar
              </th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-[#F5F5F5]' : 'bg-white'}
                >
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[100px] text-theme-text">
                    <Popover title={item.ra}>{item.ra}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[150px] text-theme-text">
                    <Popover title={item.nome}>{item.nome}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[150px] text-theme-text">
                    <Popover title={item.telefone}>{item.telefone}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[150px] text-theme-text">
                    <Popover title={item.email}>{item.email}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[150px] text-theme-text">
                    <Popover title={item.curso}>{item.curso}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[80px] text-theme-text">
                    <Popover title={String(item.ano)}>{item.ano}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium flex gap-2">
                    <Popover title="Editar">
                      <button
                        onClick={() => {
                          const user = dados.find((d) => d.ra === item.ra);
                          if (user) {
                            setFormData({ ...user });
                            setOpenEditUser({ status: true, id: item.id });
                          }
                        }}
                      >
                        <BorderColorIcon
                          className="text-theme-blue"
                          sx={{ width: 20, height: 20 }}
                        />
                      </button>
                    </Popover>
                    <Popover title="Excluir">
                      <button
                        onClick={() =>
                          setOpenExcluir({ status: true, id: item.id })
                        }
                      >
                        <PersonRemoveIcon
                          className="text-theme-blue"
                          sx={{ width: 22, height: 22 }}
                        />
                      </button>
                    </Popover>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-3 text-center text-sm text-theme-blue font-normal"
                >
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
