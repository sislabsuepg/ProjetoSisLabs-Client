"use client";

import Loading from "@/app/loading";
import { IRegistro, IUsuario } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface FiltroDatas {
  inicio: string; // yyyy-mm-dd
  fim: string; // yyyy-mm-dd
}

export default function RegistrosPage() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [registros, setRegistros] = useState<IRegistro[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<
    number | "" | null
  >(null);
  const [datas, setDatas] = useState<FiltroDatas>({ inicio: "", fim: "" });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const buscaUsuarios = async () => {
      try {
        const response = await apiOnline.get<IUsuario[]>("/usuario");
        setUsuarios(response.data || []);
      } catch (e: unknown) {
        setUsuarios([]);
        const error = e as
          | { response?: { data?: { erros?: string[] } } }
          | undefined;
        if (error?.response?.data?.erros) {
          error.response.data.erros.forEach((err: string) => toast.error(err));
        } else {
          toast.error("Erro ao buscar usuários.");
        }
      } finally {
        setLoading(false);
      }
    };
    buscaUsuarios();
  }, []);

  useEffect(() => {
    // Busca registros somente quando há usuário selecionado (igual lógica antiga)
    const fetchRegistros = async () => {
      if (!usuarioSelecionado) {
        setRegistros([]);
        return;
      }
      try {
        const response = await apiOnline.get<IRegistro[]>("/registro", {
          params: {
            usuarioId: usuarioSelecionado,
            inicio: datas.inicio ? new Date(datas.inicio) : undefined,
            fim: datas.fim ? new Date(datas.fim) : undefined,
          },
        });
        setRegistros(response.data || []);
      } catch (e: unknown) {
        setRegistros([]);
        const error = e as
          | { response?: { data?: { erros?: string[] } } }
          | undefined;
        if (error?.response?.data?.erros) {
          error.response.data.erros.forEach((err: string) => toast.error(err));
        } else {
          toast.error("Erro ao buscar registros.");
        }
      }
    };
    fetchRegistros();
  }, [usuarioSelecionado, datas]);

  const registrosFiltrados = useMemo(() => {
    // Filtro adicional local por data caso queira filtrar sem chamar API novamente (mantendo instrução de não criar novas interações):
    return registros
      .slice()
      .sort(
        (a, b) =>
          new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
      )
      .filter((r) => {
        if (datas.inicio) {
          const inicioTs = new Date(datas.inicio).getTime();
          if (new Date(r.dataHora).getTime() < inicioTs) return false;
        }
        if (datas.fim) {
          const fimDate = new Date(datas.fim);
          fimDate.setHours(23, 59, 59, 999);
          if (new Date(r.dataHora).getTime() > fimDate.getTime()) return false;
        }
        return true;
      });
  }, [registros, datas]);

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
              setUsuarioSelecionado(val ? Number(val) : null);
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
            onChange={(e) =>
              setDatas((d) => ({ ...d, inicio: e.target.value }))
            }
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
        <button
          type="button"
          className="ml-auto text-sm px-4 py-2 rounded border bg-white hover:bg-gray-100"
          onClick={() => {
            setUsuarioSelecionado(null);
            setDatas({ inicio: "", fim: "" });
          }}
        >
          Limpar
        </button>
      </div>

      <div className="w-full h-full flex flex-col justify-between mt-5">
        <div className="h-full overflow-y-auto rounded-lg bg-theme-white">
          <table className="h-full min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase w-1/4">
                  Login
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase w-1/4">
                  Nome
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase w-1/4">
                  Data / Hora
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-theme-blue uppercase w-1/4">
                  Descrição
                </th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length > 0 ? (
                registrosFiltrados.map((registro, index) => (
                  <tr
                    key={registro.id}
                    className={`${
                      index % 2 === 0 ? "bg-[#F5F5F5]" : "bg-white"
                    } border-b last:border-0`}
                  >
                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/4">
                      {registro.usuario?.login || "-"}
                    </td>
                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/4">
                      {registro.usuario?.nome || "-"}
                    </td>
                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/4">
                      {new Date(registro.dataHora).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text w-1/4">
                      {registro.descricao}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-sm text-theme-blue font-normal"
                  >
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
