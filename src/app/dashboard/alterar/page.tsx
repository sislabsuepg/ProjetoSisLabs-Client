"use client";

import CustomModal from "@/components/CustomModal";
import EditUserModal from "@/components/EditUser";
import { formMap, placeholderMap } from "@/components/Lists/data";
import { apiOnline } from "@/services/services";
import ListAcademico from "@/components/Lists/ListAcademico";
import ListLaboratorio from "@/components/Lists/ListLaboratorio";
import ListOrientacao from "@/components/Lists/ListOrientacao";
import ListProfessor from "@/components/Lists/ListProfessor";
import ListCurso from "@/components/Lists/ListCurso";
import ListPermissao from "@/components/Lists/ListPermissao";
import ListUsuario from "@/components/Lists/ListUsuario";
import {
  FormAcademico,
  FormCurso,
  FormLaboratorio,
  FormOrientacao,
  FormPermissao,
  FormProfessor,
  FormUsuario,
  IData,
} from "@/components/Lists/types";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

export default function Alterar() {
  const [activeId, setActiveId] = useState(1);
  const [filtro, setFiltro] = useState("");
  const [openExcluir, setOpenExcluir] = useState({ status: false, id: 0 });
  const [openEditUser, setOpenEditUser] = useState({ status: false, id: 0 });
  const [currentItems, setCurrentItems] = useState<IData[]>([]);
  const [formData, setFormData] = useState<IData>(formMap[activeId]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const listButtons = [
    {
      id: 1,
      title: "Acadêmico",
    },
    {
      id: 2,
      title: "Professor",
    },
    { id: 3, title: "Laboratório" },
    { id: 4, title: "Orientação/Mestrado" },
    { id: 5, title: "Curso" },
    { id: 6, title: "Permissão" },
    { id: 7, title: "Usuário" },
  ];

  const mapRoutes: Record<number, string> = {
    1: "aluno",
    2: "professor",
    3: "laboratorio",
    4: "orientacao",
    5: "curso",
    6: "permissao",
    7: "usuario",
  };

  const handleSaveEditUser = async () => {
    const id = openEditUser.id;
    if (id === 0) return;
    if (!formData) return;
    if (!("id" in formData)) return;
    if (formData.id !== id) {
      toast.error("ID do formulário não corresponde ao ID do usuário.");
      return;
    }

    const updatedItem = currentItems.find((item) => item.id === id);
    if (!updatedItem) {
      toast.error(`${listButtons.find((btn) => btn.id === activeId)?.title} não encontrado.`);
      return;
    }
    
    // Preparar dados para envio - garantir que idPermissao está correto e telefone sem máscara
    let dataToSend = { ...formData };
    
    // Se estivermos editando um usuário e há permissaoUsuario definido, garantir que idPermissao está correto
    if (activeId === 7 && "permissaoUsuario" in formData && formData.permissaoUsuario) {
      const permissao = formData.permissaoUsuario as any;
      if (permissao.id) {
        dataToSend = { ...dataToSend, idPermissao: permissao.id };
      }
    }
    
    // Se estivermos editando um acadêmico e há telefone, garantir que seja enviado sem máscara
    if (activeId === 1 && "telefone" in formData && formData.telefone) {
      // O telefone já deve estar sem máscara pois é tratado no EditUserModal
      // mas vamos garantir removendo qualquer máscara restante
      const telefone = formData.telefone as string;
      dataToSend = { ...dataToSend, telefone: telefone.replace(/\D/g, '') };
    }
    
    // Log para debug: verificar os dados que estão sendo enviados
    console.log("Dados sendo enviados para o backend:", dataToSend);
    console.log("Rota:", `/${mapRoutes[activeId]}/${id}`);
    
    try{
      await apiOnline.put(`/${mapRoutes[activeId]}/${id}`, dataToSend);
    }catch(err){
      const error = err as any;
      console.error("Erro ao atualizar no backend:", error);
      if(error.response?.data?.erros){
        error.response.data.erros.forEach((e: string) => toast.error(e));
      }else{
        toast.error("Erro ao atualizar os dados. Tente novamente.");
      }
      return;
    }


    setCurrentItems((prev) =>
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
            case 5: {
              const data = formData as FormCurso;
              return { ...item, ...data };
            }
            case 6: {
              const data = formData as FormPermissao;
              return { ...item, ...data };
            }
            case 7: {
              const data = formData as FormUsuario;
              return { ...item, ...data };
            }
            default:
              return item;
          }
        }
        return item;
      })
    );

    setOpenEditUser({ status: false, id: 0 });
    toast.success("Dados atualizados com sucesso!");
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
      case 5:
        return currentItems as FormCurso[];
      case 6:
        return currentItems as FormPermissao[];
      case 7:
        return currentItems as FormUsuario[];
      default:
        return [];
    }
  };

  const getDados = async (id: number) => {
    switch (id) {
      case 1:
        try {
          const countResponse = await apiOnline.get<{ count: number }>(
          "/aluno/count"
          );
          const count = countResponse?.count ?? 0;
          setTotalPages(Math.ceil(count / itemsPerPage));
          const response = await apiOnline.get(`/aluno?page=${currentPage}&items=${itemsPerPage}`);
          return response.data as FormAcademico[];
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          return [];
        }

      case 2:
        try {
          const countResponse = await apiOnline.get<{ count: number }>(
            "/professor/count"
          );
          const count = countResponse?.count ?? 0;
          setTotalPages(Math.ceil(count / itemsPerPage));
          const response = await apiOnline.get(`/professor?page=${currentPage}&items=${itemsPerPage}`);
          return response.data as FormProfessor[];
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          return [];
        }
      case 3:
        try {
          const countResponse = await apiOnline.get<{ count: number }>(
            "/laboratorio/count"
          );
          const count = countResponse?.count ?? 0;
          setTotalPages(Math.ceil(count / itemsPerPage));
          const response = await apiOnline.get(`/laboratorio?page=${currentPage}&items=${itemsPerPage}`);
          return response.data as FormLaboratorio[];
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          return [];
        }
      case 4:

        try {
          const countResponse = await apiOnline.get<{ count: number }>(
            "/orientacao/count"
          );
          const count = countResponse?.count ?? 0;
          setTotalPages(Math.ceil(count / itemsPerPage));
          const response = await apiOnline.get(`/orientacao?page=${currentPage}&items=${itemsPerPage}`);
          return response.data as FormOrientacao[];
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          return [];
        }
      case 5:
        try {
          const countResponse = await apiOnline.get<{ count: number }>(
            "/curso/count"
          );
          const count = countResponse?.count ?? 0;
          setTotalPages(Math.ceil(count / itemsPerPage));
          const response = await apiOnline.get(`/curso?page=${currentPage}&items=${itemsPerPage}`);
          return response.data as FormCurso[];
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          return [];
        }
      case 6:
        try {
          const countResponse = await apiOnline.get<{ count: number }>(
            "/permissao/count"
          );
          const count = countResponse?.count ?? 0;
          setTotalPages(Math.ceil(count / itemsPerPage));
          const response = await apiOnline.get(`/permissao?page=${currentPage}&items=${itemsPerPage}`);
          return response.data as FormPermissao[];
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          return [];
        }
      case 7:
        try {
          const countResponse = await apiOnline.get<{ count: number }>(
            "/usuario/count"
          );
          const count = countResponse?.count ?? 0;
          setTotalPages(Math.ceil(count / itemsPerPage));
          const response = await apiOnline.get(`/usuario?page=${currentPage}&items=${itemsPerPage}`);
          return response.data as FormUsuario[];
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          return [];
        }
      default:
        return [];
    }
  };
  useEffect(() => {
    setLoading(true);
    getDados(activeId).then((data) => setCurrentItems(data));
    setCurrentPage(1);
    setFormData(formMap[activeId]);
    setLoading(false);
  }, [activeId]);

  useEffect(() => {
    setFormData(formMap[activeId]);
  }, [activeId]);

  useEffect(() => {
setLoading(true);
    getDados(activeId).then((data) => setCurrentItems(data));
    setFormData(formMap[activeId]);
    setLoading(false);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  console.log(currentItems);

  return (
    <div className="w-full flex flex-col items-start">
      <div className="w-full flex items-center justify-center gap-2">
        {listButtons?.map((item) => (
          <button
            key={item?.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item?.id === activeId ? "bg-theme-lightBlue" : "bg-theme-blue"
            } h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
          >
            {item?.title}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between w-full mt-10 mb-3">
        <p className="font-semibold text-[1.2rem] text-theme-blue">
          {activeId === 1 && "Lista dos Acadêmicos"}
          {activeId === 2 && "Lista dos Professores"}
          {activeId === 3 && "Lista dos Laboratórios"}
          {activeId === 4 && "Lista de Orientação/Mestrado"}
          {activeId === 5 && "Lista dos Cursos"}
          {activeId === 6 && "Lista das Permissões"}
          {activeId === 7 && "Lista dos Usuários"}
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
                ? "bg-gray-200 cursor-not-allowed text-[#c0c0c0]"
                : "border border-theme-blue hover:bg-theme-blue text-theme-blue hover:text-theme-white"
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
            dados={currentItems as FormAcademico[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}
        {activeId === 2 && (
          <ListProfessor
            list={getCurrentList() as FormProfessor[]}
            dados={currentItems as FormProfessor[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}
        {activeId === 3 && (
          <ListLaboratorio
            list={getCurrentList() as FormLaboratorio[]}
            dados={currentItems as FormLaboratorio[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}
        {activeId === 4 && (
          <ListOrientacao
            list={getCurrentList() as FormOrientacao[]}
            dados={currentItems as FormOrientacao[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}
        {activeId === 5 && (
          <ListCurso
            list={getCurrentList() as FormCurso[]}
            dados={currentItems as FormCurso[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}
        {activeId === 6 && (
          <ListPermissao
            list={getCurrentList() as FormPermissao[]}
            dados={currentItems as FormPermissao[]}
            setFormData={setFormData}
            setOpenEditUser={setOpenEditUser}
            setOpenExcluir={setOpenExcluir}
          />
        )}
        {activeId === 7 && (
          <ListUsuario
            list={getCurrentList() as FormUsuario[]}
            dados={currentItems as FormUsuario[]}
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
        onClose={() => setOpenExcluir({ status: false, id: 0 })}
        title="Atenção"
        message="Deseja, realmente, excluir o usuário?"
        onCancel={() => setOpenExcluir({ status: false, id: 0 })}
        onConfirm={() => {
          setCurrentItems((prev) =>
            prev.filter((el) => el.id !== openExcluir.id)
          );
          setOpenExcluir({ status: false, id: 0 });
          toast.success("Usuário removido com sucesso!");
        }}
        cancelText="Cancelar"
        confirmText="Desativar usuário"
      />

      <EditUserModal<typeof formData>
        open={openEditUser.status}
        onClose={() => setOpenEditUser({ status: false, id: 0 })}
        onSave={handleSaveEditUser}
        formData={formData}
        onChange={(field, value) =>
          setFormData((prev) => ({ ...prev, [field]: value }))
        }
        title={listButtons.find((btn) => btn.id === activeId)?.title || ""}
      />
    </div>
  );
}
