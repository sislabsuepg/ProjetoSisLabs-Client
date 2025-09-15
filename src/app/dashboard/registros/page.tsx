"use client";

import Loading from "@/app/loading";
import { IRegistro, IUsuario } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import ListaRegistros from "@/components/Registros";
import { count } from "console";

interface FiltroDatas {
  inicio: string; // yyyy-mm-dd
  fim: string; // yyyy-mm-dd
}

export default function RegistrosPage() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [registros, setRegistros] = useState<IRegistro[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number>(0);
  const [datas, setDatas] = useState<FiltroDatas>({ inicio: "", fim: "" });
  const [buscaRegistros, setBuscaRegistros] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);
  const itensPorPagina = 10;

  useEffect(() => {
    setLoading(true);
    const buscaUsuarios = async () => {
      try {
        const response = await apiOnline.get<{ data: IUsuario[] }>("/usuario");
        setUsuarios(response.data);
      } catch (error) {
        if (error?.response?.data?.erros) {
          error.response.data.erros.map((err: string) => toast.error(err));
        } else {
          toast.error("Erro ao buscar usuários");
        }
      } finally {
        setLoading(false);
      }
    };
    buscaUsuarios();
  }, []);

  useEffect(() => {
    let query = `?page=${paginaAtual}&limit=${itensPorPagina}`;
    if (usuarioSelecionado) {
      query += `&idUsuario=${usuarioSelecionado}`;
    }
    if (datas.inicio && datas.fim) {
      query += `&dataInicio=${datas.inicio}&dataFim=${datas.fim}`;
    }
    const buscaRegistros = async () => {
      setLoading(true);
      try {
        const repCount = await apiOnline.get<{ total: number }>(
          "/registro/count"
        );
        let total = repCount.count ?? 0;
        setTotalRegistros(total);
        setTotalPaginas(Math.ceil(total / itensPorPagina));
        const response = await apiOnline.get<{ data: IRegistro[] }>(
          `/registro${query}`
        );
        if (response.data.total !== total) {
          setTotalRegistros(response.data.total);
        }
        setRegistros(response.data.registros);
        setTotalPaginas(Math.ceil(response.data.total / itensPorPagina));
      } catch (error) {
        if (error?.response?.data?.erros) {
          error.response.data.erros.map((err: string) => toast.error(err));
          setRegistros([]);
        } else {
          toast.error("Erro ao buscar registros");
        }
      } finally {
        setLoading(false);
      }
    };
    buscaRegistros();
  }, [buscaRegistros, paginaAtual]);

  if (loading) return <Loading />;

  return (
    <div className="w-full p-4 flex flex-col h-full">
      <h1 className="font-semibold text-[1.2rem] text-theme-blue">Registros</h1>
      <div className="mt-4 flex flex-wrap gap-4 items-end bg-theme-white rounded-lg p-4 border">
        <div className="flex flex-col min-w-[220px]">
          <label className="text-xs font-medium text-theme-blue mb-1">
            Usuário
          </label>
          <select
            className="border rounded px-2 py-2 text-sm bg-white"
            value={usuarioSelecionado ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setUsuarioSelecionado(val ? Number(val) : 0);
            }}
          >
            <option value="">-- Selecione --</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id || ""}>
                {u.login} - {u.nome}
                {u.ativo === false ? " (desativado)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-theme-blue mb-1">
            Data início
          </label>
          <input
            type="date"
            className="border rounded px-2 py-2 text-sm"
            value={datas.inicio}
            onChange={(e) => {
              if (
                new Date(e.target.value) > new Date(datas.fim) &&
                datas.fim !== ""
              ) {
                toast.error("Data início não pode ser maior que data fim");
                return;
              }
              setDatas((d) => ({ ...d, inicio: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-theme-blue mb-1">
            Data fim
          </label>
          <input
            type="date"
            className="border rounded px-2 py-2 text-sm"
            value={datas.fim}
            onChange={(e) => setDatas((d) => ({ ...d, fim: e.target.value }))}
          />
        </div>
        <span className="flex gap-2 mr-auto">
          <button
            type="button"
            className="ml-auto text-sm px-4 py-2 rounded border bg-white hover:bg-gray-100"
            onClick={() => {
              setBuscaRegistros(!buscaRegistros);
            }}
          >
            Buscar
          </button>
          <button
            type="button"
            className="ml-auto text-sm px-4 py-2 rounded border bg-white hover:bg-gray-100"
            onClick={() => {
              setUsuarioSelecionado(0);
              setDatas({ inicio: "", fim: "" });
              setBuscaRegistros(!buscaRegistros);
            }}
          >
            Limpar
          </button>
        </span>
      </div>

      <div className="w-full h-full flex flex-col justify-between mt-5">
        <div className="h-full overflow-y-auto rounded-lg bg-theme-white">
          <ListaRegistros list={registros} />
        </div>
        {registros && registros.length > 0 && (
          <Pagination
            currentPage={paginaAtual}
            totalPages={totalPaginas}
            onPageChange={(p) => setPaginaAtual(p)}
          />
        )}
      </div>
    </div>
  );
}
