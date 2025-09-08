'use client';

import Popover from '@/components/Popover';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { FormPermissao } from './types';

interface Props {
  list: FormPermissao[];
  dados: FormPermissao[];
  setFormData: (data: FormPermissao) => void;
  setOpenEditUser: (state: { status: boolean; id: number }) => void;
  setOpenExcluir: (state: { status: boolean; id: number }) => void;
}

export default function ListLaboratorio({
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
              <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase">
                Nome
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase">
                Geral
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase">
                Cadastro
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase">
                Edição
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase">
                Advertência
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase">
                Relatório
              </th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? 'bg-[#F5F5F5]' : 'bg-white'
                  } border-b last:border-0`}
                >
                  <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/3">
                    <Popover title={item.nomePermissao}>{item.nomePermissao}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/3">
                    <Popover title={item.geral ? 'Sim' : 'Não'}>{item.geral ? 'Sim' : 'Não'}</Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/3">
                    <Popover title={item.cadastro ? 'Sim' : 'Não'}>
                      {item.cadastro ? 'Sim' : 'Não'}
                    </Popover>
                  </td>
                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/3">
                    <Popover title={item.alteracao ? 'Sim' : 'Não'}>
                        {item.alteracao ? 'Sim' : 'Não'}
                    </Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/3">
                    <Popover title={item.advertencia ? 'Sim' : 'Não'}>
                        {item.advertencia ? 'Sim' : 'Não'}
                    </Popover>
                    </td>
                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/3">
                    <Popover title={item.relatorio ? 'Sim' : 'Não'}>
                        {item.relatorio ? 'Sim' : 'Não'}
                    </Popover>
                  </td>
                  <td className="px-4 py-3 text-[0.8rem] font-medium w-[100px]">
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
                      <Popover title="Desativar">
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
                  colSpan={3}
                  className="px-4 py-2 text-center text-sm text-theme-blue font-normal"
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
