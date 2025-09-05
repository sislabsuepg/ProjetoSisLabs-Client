'use client';

import Popover from '@/components/Popover';
import { maskDate } from '@/utils/maskDate';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { FormOrientacao } from './types';

interface Props {
  list: FormOrientacao[];
  dados: FormOrientacao[];
  setFormData: (data: FormOrientacao) => void;
  setOpenEditUser: (state: { status: boolean; id: number }) => void;
  setOpenExcluir: (state: { status: boolean; id: number }) => void;
}

export default function ListOrientacao({
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
                Aluno
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                Professor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                Laboratório
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                Data início
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-blue uppercase">
                Data fim
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
                    <Popover title={item?.aluno?.nome}>{item?.aluno?.nome}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[150px] text-theme-text">
                    <Popover title={item?.professor?.nome}>{item?.professor?.nome}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[150px] text-theme-text">
                    <Popover title={item?.laboratorio?.numero}>{item?.laboratorio?.numero}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[150px] text-theme-text">
                    <Popover title={maskDate(item.dataInicio)}>
                      {maskDate(item.dataInicio?.split("T")[0])}
                    </Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium max-w-[80px] text-theme-text">
                    <Popover title={maskDate(item.dataFim)}>
                      {maskDate(item.dataFim?.split("T")[0])}
                    </Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium flex gap-2">
                    <div className="flex items-center justify-center gap-3">
                      <Popover title="Editar">
                        <button
                          onClick={() => {
                            const user = dados.find((d) => d.id === item.id);
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
                    </div>
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
