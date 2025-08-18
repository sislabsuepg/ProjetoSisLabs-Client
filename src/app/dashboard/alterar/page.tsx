'use client';

import CustomModal from '@/components/CustomModal';
import EditUserModal from '@/components/EditUser';
import Pagination from '@/components/Pagination';
import Popover from '@/components/Popover';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface IData {
  ra: string;
  nome: string;
  telefone: string;
  email: string;
  curso: string;
  ano: number;
}

export default function Alterar() {
  const [activeId, setActiveId] = useState(1);
  const [dados, setDados] = useState([] as IData[]);
  const [filtro, setFiltro] = useState('');
  const [openExcluir, setOpenExcluir] = useState({ status: false, id: '' });
  const [openEditUser, setOpenEditUser] = useState({ status: false, id: '' });
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    email: '',
    telefone: '',
    curso: '',
    periodo: '',
  });

  useEffect(() => {
    // Simulação de busca na API
    const mockData: IData[] = [
      {
        ra: '11022126',
        nome: 'Gabriel Antonio Becher',
        telefone: '(42) 9 9999-9999',
        email: 'gabrielbc@gmail.com',
        curso: 'Engenharia de Software',
        ano: 3,
      },
      {
        ra: '11022127',
        nome: 'Maria Silva',
        telefone: '(42) 9 8888-8888',
        email: 'maria.silva@gmail.com',
        curso: 'Ciência da Computação',
        ano: 2,
      },
      {
        ra: '11022133',
        nome: 'Maria Silva 3',
        telefone: '(42) 9 8888-8888',
        email: 'maria.silva@gmail.com',
        curso: 'Ciência da Computação',
        ano: 2,
      },
      {
        ra: '113452133',
        nome: 'Maria Silva 3',
        telefone: '(42) 9 8888-8888',
        email: 'maria.silva@gmail.com',
        curso: 'Ciência da Computação',
        ano: 2,
      },
      {
        ra: '110267133',
        nome: 'Maria Silva 3',
        telefone: '(42) 9 8888-8888',
        email: 'maria.silva@gmail.com',
        curso: 'Ciência da Computação',
        ano: 2,
      },
      {
        ra: '11024433',
        nome: 'Maria Silva 3',
        telefone: '(42) 9 8888-8888',
        email: 'maria.silva@gmail.com',
        curso: 'Ciência da Computação',
        ano: 2,
      },
      {
        ra: '110226533',
        nome: 'Maria Silva 3',
        telefone: '(42) 9 8888-8888',
        email: 'maria.silva@gmail.com',
        curso: 'Ciência da Computação',
        ano: 2,
      },
      {
        ra: '110221233',
        nome: 'Maria Silva 3',
        telefone: '(42) 9 8888-8888',
        email: 'maria.silva@gmail.com',
        curso: 'Ciência da Computação',
        ano: 2,
      },
      {
        ra: '11029833',
        nome: 'Maria Silva 3',
        telefone: '(42) 9 8888-8888',
        email: 'maria.silva@gmail.com',
        curso: 'Ciência da Computação',
        ano: 2,
      },
      {
        ra: '1102773',
        nome: 'Maria Silva 000',
        telefone: '(42) 9 8888-8888',
        email: 'maria.silva@gmail.com',
        curso: 'Ciência da Computação',
        ano: 2,
      },
    ];
    setDados(mockData);
  }, []);

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = dados.slice(startIndex, startIndex + itemsPerPage);

  const listButtons = [
    { id: 1, title: 'Acadêmico' },
    { id: 2, title: 'Professor' },
    { id: 3, title: 'Laboratório' },
    { id: 4, title: 'Orientação/Mestrado' },
  ];

  const renderFormulario = () => {
    switch (activeId) {
      case 1:
        return (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <input
                placeholder="Pesquisar acadêmico"
                type="text"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full max-w-[250px] font-normal h-[40px] px-3 py-2 text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
              />
              <button
                type="submit"
                className={`disabled:bg-gray-400 border border-theme-blue hover:bg-theme-blue font-medium h-[40px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-theme-blue hover:text-theme-white rounded-[10px]`}
              >
                Buscar
              </button>
            </div>

            <div className="overflow-y-auto rounded-lg bg-theme-white mt-5">
              <table className="min-w-full">
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
                  {currentItems?.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr
                        key={item.ra}
                        className={
                          index % 2 === 0 ? 'bg-[#F5F5F5]' : 'bg-white'
                        }
                      >
                        <td className="px-4 py-3 text-[0.8rem] text-theme-text font-medium max-w-[100px]">
                          <Popover title={item.ra}>{item.ra}</Popover>
                        </td>
                        <td className="px-4 py-3 text-[0.8rem] text-theme-text font-medium max-w-[150px]">
                          <Popover title={item.nome}>{item.nome}</Popover>
                        </td>
                        <td className="px-4 py-3 text-[0.8rem] text-theme-text font-medium max-w-[150px]">
                          <Popover title={item.telefone}>
                            {item.telefone}
                          </Popover>
                        </td>
                        <td className="px-4 py-3 text-[0.8rem] text-theme-text font-medium max-w-[150px]">
                          <Popover title={item.email}>{item.email}</Popover>
                        </td>
                        <td className="px-4 py-3 text-[0.8rem] text-theme-text font-medium max-w-[150px]">
                          <Popover title={item.curso}>{item.curso}</Popover>
                        </td>
                        <td className="px-4 py-3 text-[0.8rem] text-theme-text font-medium max-w-[80px]">
                          <Popover title={String(item.ano)}>{item.ano}</Popover>
                        </td>
                        <td className="px-4 py-3 text-[0.8rem] text-theme-text font-medium flex gap-2">
                          <Popover title="Editar">
                            <button
                              onClick={() => {
                                const user = dados.find(
                                  (d) => d.ra === item.ra,
                                );
                                if (user) {
                                  setFormData({
                                    nome: user.nome,
                                    matricula: user.ra, // supondo que RA é matrícula
                                    email: user.email,
                                    telefone: user.telefone,
                                    curso: user.curso,
                                    periodo: String(user.ano), // ou outro campo
                                  });
                                  setOpenEditUser({
                                    status: true,
                                    id: item.ra,
                                  });
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
                              onClick={() => {
                                setOpenExcluir({ status: true, id: item?.ra });
                              }}
                            >
                              <DeleteIcon
                                className="text-theme-red"
                                sx={{ width: 20, height: 20 }}
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
                        className="px-4 py-3 text-center text-sm text-theme-blue"
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
      case 2:
        return <form className="mt-4 space-y-4">aaaaaa</form>;
      case 3:
        return (
          <form className="mt-4 space-y-4">
            <label className="block">
              Curso:
              <select className="border rounded p-2 w-full">
                <option>Engenharia de Software</option>
                <option>Sistemas de Informação</option>
              </select>
            </label>
            <label className="block">
              Período:
              <input type="text" className="border rounded p-2 w-full" />
            </label>
            <button
              type="submit"
              className="bg-theme-blue text-white px-4 py-2 rounded"
            >
              Gerar Relatório
            </button>
          </form>
        );
      default:
        return null;
    }
  };

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

      <div className="mt-5 w-full">
        {renderFormulario()}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <CustomModal
        open={openExcluir?.status}
        onClose={() => setOpenExcluir({ status: false, id: '' })}
        title="Atenção"
        message="Deseja, realmente, excluir o usuário?"
        onCancel={() => {
          setOpenExcluir({ status: false, id: '' });
        }}
        onConfirm={() => {
          setDados((prevDados) =>
            prevDados.filter((el) => el.ra !== openExcluir?.id),
          );
          setOpenExcluir({ status: false, id: '' });
          toast.success('Usuário removido com sucesso!');
        }}
        cancelText="Cancelar"
        confirmText="Excluir"
      />

      <EditUserModal
        open={openEditUser.status}
        onClose={() => setOpenEditUser({ status: false, id: '' })}
        onSave={() => {
          setDados((prev) =>
            prev.map((user) =>
              user.ra === openEditUser.id
                ? {
                    ...user,
                    nome: formData.nome,
                    email: formData.email,
                    telefone: formData.telefone,
                    curso: formData.curso,
                    ano: Number(formData.periodo),
                  }
                : user,
            ),
          );
          setOpenEditUser({ status: false, id: '' });
          toast.success('Usuário atualizado com sucesso!');
        }}
        formData={formData}
        onChange={(field, value) =>
          setFormData((prev) => ({ ...prev, [field]: value }))
        }
      />
    </div>
  );
}
