'use client';

import CustomModal from '@/components/CustomModal';
import EditUserModal from '@/components/EditUser';
import {
  formMap,
  mockAcademicos,
  mockLaboratorios,
  mockOrientacoes,
  mockProfessores,
  placeholderMap,
} from '@/components/Lists/data';
import { ApiResponse, IAcademico, IProfessor, ILaboratorio, IOrientacao } from '@/interfaces/interfaces';
import { apiOnline } from '@/services/services';
import ListAcademico from '@/components/Lists/ListAcademico';
import ListLaboratorio from '@/components/Lists/ListLaboratorio';
import ListOrientacao from '@/components/Lists/ListOrientacao';
import ListProfessor from '@/components/Lists/ListProfessor';
import {
  FormAcademico,
  FormLaboratorio,
  FormOrientacao,
  FormProfessor,
  IData,
} from '@/components/Lists/types';
import Pagination from '@/components/Pagination';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Alterar() {
  const [activeId, setActiveId] = useState(1);
  const [dados, setDados] = useState([] as IData[]);
  const [filtro, setFiltro] = useState('');
  const [openExcluir, setOpenExcluir] = useState({ status: false, id: '' });
  const [openEditUser, setOpenEditUser] = useState({ status: false, id: '' });
  const [formData, setFormData] = useState<IData>(formMap[activeId]);
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = dados.slice(startIndex, startIndex + itemsPerPage);
  const [loading, setLoading] = useState(true);

  const listButtons = [
    {
      id: 1,
      title: 'Acadêmico',
    },
    {
      id: 2,
      title: 'Professor',
    },
    { id: 3, title: 'Laboratório' },
    { id: 4, title: 'Orientação/Mestrado' },
  ];

  const handleSaveEditUser = () => {
    setDados((prev) =>
      prev.map((item) => {
        if (item.id === openEditUser.id) {
          switch (activeId) {
            case 1: {
              const data = formData as FormAcademico;
              return { ...item, ...data };
            }
            case 2: {
              const data = formData as FormProfessor;
              return { ...item, ...data };
            }
            case 3: {
              const data = formData as FormLaboratorio;
              return { ...item, ...data };
            }
            case 4: {
              const data = formData as FormOrientacao;
              return { ...item, ...data };
            }
            default:
              return item;
          }
        }
        return item;
      }),
    );

    setOpenEditUser({ status: false, id: '' });
    toast.success('Dados atualizados com sucesso!');
  };

  const getCurrentList = () => {
    switch (activeId) {
      case 1:
        return currentItems as FormAcademico[];
      case 2:
        return currentItems as FormProfessor[];
      case 3:
        return currentItems as FormLaboratorio[];
      case 4:
        return currentItems as FormOrientacao[];
      default:
        return [];
    }
  };

  const getDados = async (id: number) => {
    switch (id) {
      case 1:
        try {
          const response = await apiOnline.get(`/aluno`);
          return response.data;
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          return [];
        }

      case 2:
        try {
          const response = await apiOnline.get(`/professor`);
          return response.data;
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          return [];
        }
    };
  }
  useEffect(() => {
    setLoading(true);
    getDados(activeId).then((data) => setDados(data));
    setCurrentPage(1);
    setFormData(formMap[activeId]);
    setLoading(false);
  }, [activeId]);

  useEffect(() => {
    setFormData(formMap[activeId]);
  }, [activeId]);

  if(loading){
    return <div>Loading...</div>;
  }

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

      <div className="flex items-center justify-between w-full mt-10 mb-3">
        <p className="font-semibold text-[1.2rem] text-theme-blue">
          {activeId === 1 && 'Lista dos Acadêmicos'}
          {activeId === 2 && 'Lista dos Professores'}
          {activeId === 3 && 'Lista dos Laboratórios'}
          {activeId === 4 && 'Lista de Orientação/Mestrado'}
        </p>

        <div className="flex items-center justify-end gap-2 w-full max-w-[500px]">
          <input
            placeholder={placeholderMap[activeId]}
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full max-w-[250px] font-normal h-[40px] px-3 py-2 text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
          />
          <button
            type="submit"
            disabled={!filtro.trim()}
            className={`${
              !filtro.trim()
                ? 'bg-gray-200 cursor-not-allowed text-[#c0c0c0]'
                : 'border border-theme-blue hover:bg-theme-blue text-theme-blue hover:text-theme-white'
            } font-medium h-[40px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] rounded-[10px]`}
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="w-full">
        {activeId === 1 && (
          <ListAcademico
            list={getCurrentList() as FormAcademico[]}
            dados={dados as FormAcademico[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}
        {activeId === 2 && (
          <ListProfessor
            list={getCurrentList() as FormProfessor[]}
            dados={dados as FormProfessor[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}
        {activeId === 3 && (
          <ListLaboratorio
            list={getCurrentList() as FormLaboratorio[]}
            dados={dados as FormLaboratorio[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}
        {activeId === 4 && (
          <ListOrientacao
            list={getCurrentList() as FormOrientacao[]}
            dados={dados as FormOrientacao[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}

        {getCurrentList()?.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <CustomModal
        open={openExcluir.status}
        onClose={() => setOpenExcluir({ status: false, id: '' })}
        title="Atenção"
        message="Deseja, realmente, excluir o usuário?"
        onCancel={() => setOpenExcluir({ status: false, id: '' })}
        onConfirm={() => {
          setDados((prev) => prev.filter((el) => el.id !== openExcluir.id));
          setOpenExcluir({ status: false, id: '' });
          toast.success('Usuário removido com sucesso!');
        }}
        cancelText="Cancelar"
        confirmText="Desativar usuário"
      />

      <EditUserModal<typeof formData>
        open={openEditUser.status}
        onClose={() => setOpenEditUser({ status: false, id: '' })}
        onSave={handleSaveEditUser}
        formData={formData}
        onChange={(field, value) =>
          setFormData((prev) => ({ ...prev, [field]: value }))
        }
      />
    </div>
  );
}
