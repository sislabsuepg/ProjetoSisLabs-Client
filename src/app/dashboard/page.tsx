"use client";

import Pagination from "@/components/Pagination";
import { ApiResponse, IEmprestimo } from "@/interfaces/interfaces";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { apiOnline } from "@/services/services";
import { CircularProgress } from "@mui/material";
import CustomModal from "@/components/CustomModal";
import DeleteIcon from '@mui/icons-material/Delete';
import Popover from "@/components/Popover";

export default function Inicio() {
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [update, setUpdate] = useState(false);
  const [openEncerrar, setOpenEncerrar] = useState<{
    status: boolean;
    id: number;
  }>({ status: false, id: 0 });
  interface ISolicitacao {
    id: string;
    idAluno: number;
    idLaboratorio: number;
    aluno: { id: number; nome: string; ra: string };
    laboratorio: { id: number; nome: string; numero: string };
  }
  const [solicitacoes, setSolicitacoes] = useState<ISolicitacao[]>([]);
  // Mapa de advertências por aluno (true se possui advertência recente)
  const [advertenciasAlunos, setAdvertenciasAlunos] = useState<
    Record<number, boolean>
  >({});
  // Ref para evitar repetir toast de advertência para o mesmo aluno
  const alunosAdvertenciaAvisadosRef = useRef<Set<number>>(new Set());
  const [cookies] = useCookies(["usuario"]);
  const permissions = cookies?.usuario?.permissao || {};
  // Ações de emprestimo (aprovar/recusar/encerrar) podem ser feitas por 'geral' ou 'cadastro'
  const canAcao = permissions?.geral === true || permissions?.cadastro === true;
  const [data, setData] = useState<IEmprestimo[]>([]);
  // Handlers para aprovar / recusar solicitações
  const handleAprovar = async (id: string) => {
    try {
      const solicitacaoInfo = solicitacoes.find((s) => s.id === id);
      await apiOnline.put(`/solicitacoes`, {
        id,
        aceita: true,
      });
      await apiOnline.post(`/emprestimo`, {
        idAluno: solicitacaoInfo?.idAluno,
        idLaboratorio: solicitacaoInfo?.idLaboratorio,
      });
      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
      toast.success("Solicitação aprovada");
      setUpdate((u) => !u);
    } catch (e: unknown) {
      const errObj = e as { response?: { data?: { erros?: string[] } } };
      if (errObj?.response?.data?.erros) {
        errObj.response.data.erros.map((err: string) => toast.error(err));
        return;
      }
      toast.error("Erro ao aprovar solicitação");
    }
  };
  const handleRecusar = async (id: string) => {
    try {
      await apiOnline.put(`/solicitacoes`, {
        id,
        aceita: false,
      });

      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
      toast.info("Solicitação recusada");
    } catch (e: unknown) {
      console.error(e);
      toast.error("Erro ao recusar solicitação");
    }
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const countResponse = await apiOnline.get<{ count: number }>(
          "/emprestimo/count?ativo=true"
        );
        const count = countResponse?.count ?? 0;
        const response = await apiOnline.get(
          `/emprestimo?page=${currentPage}&items=${itemsPerPage}`
        );
        let lista: unknown = Array.isArray(response)
          ? response
          : (response as ApiResponse).data;
        if (lista && typeof lista === "object" && !Array.isArray(lista)) {
          const possivel = (lista as Record<string, unknown>)["emprestimos"];
          if (Array.isArray(possivel)) lista = possivel;
        }
        if (!Array.isArray(lista)) lista = [];
        const emprestimos = (lista as unknown[]).filter(
          (x): x is IEmprestimo =>
            !!x && typeof x === "object" && "laboratorio" in x && "aluno" in x
        );
        setTotalPages(Math.ceil(count / itemsPerPage));
        setData(emprestimos);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, update]);

  // Polling de solicitações a cada 5s (com cleanup adequado)
  const solicitacoesPrevRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const fetchSolicitacoes = async () => {
      try {
        const solicitacoesResposta = await apiOnline.get<
          ISolicitacao[] | { data: ISolicitacao[] }
        >("/solicitacoes");
        const raw = solicitacoesResposta as {
          data: ISolicitacao[] | { data: ISolicitacao[] };
        };
        const responseData: ISolicitacao[] = Array.isArray(raw.data)
          ? (raw.data as ISolicitacao[])
          : (raw.data as { data?: ISolicitacao[] }).data || [];
        setSolicitacoes(() => {
          const prevIds = solicitacoesPrevRef.current;
          const novas = responseData.filter((s) => !prevIds.has(s.id));
          if (novas.length > 0) {
            toast.info(
              novas.length === 1
                ? `Nova solicitação: ${novas[0].aluno.nome} - Lab ${novas[0].laboratorio.numero}`
                : `${novas.length} novas solicitações de laboratório`
            );
          }
          // atualizar ref
          solicitacoesPrevRef.current = new Set(responseData.map((s) => s.id));
          return responseData;
        });

        // Buscar advertências apenas para alunos ainda não consultados
        const idsAlunoUnicos = Array.from(
          new Set(responseData.map((s) => s.idAluno).filter((id) => id != null))
        );
        const novosIds = idsAlunoUnicos.filter(
          (id) => !(id in advertenciasAlunos)
        );
        if (novosIds.length) {
          try {
            const resultados = await Promise.all(
              novosIds.map(async (id) => {
                try {
                  // Pode vir boolean direto ou objeto { data: boolean }
                  const respAd = await apiOnline.get<
                    boolean | { data: boolean }
                  >(`/aluno/advertencias/${id}`);
                  const flag =
                    typeof respAd === "boolean"
                      ? respAd
                      : respAd?.data === true;
                  return { id, flag: !!flag };
                } catch {
                  return { id, flag: false };
                }
              })
            );
            const atual: Record<number, boolean> = {};
            resultados.forEach((r) => (atual[r.id] = r.flag));
            if (Object.keys(atual).length) {
              setAdvertenciasAlunos((prev) => ({ ...prev, ...atual }));
              resultados.forEach((r) => {
                if (r.flag && !alunosAdvertenciaAvisadosRef.current.has(r.id)) {
                  const solicitacao = responseData.find(
                    (s) => s.idAluno === r.id
                  );
                  const nome = solicitacao?.aluno?.nome || `Aluno ${r.id}`;
                  const ra = solicitacao?.aluno?.ra
                    ? ` (${solicitacao.aluno.ra})`
                    : "";
                  toast.warning(
                    `Atenção: ${nome}${ra} possui advertências registradas no último mês.`
                  );
                  alunosAdvertenciaAvisadosRef.current.add(r.id);
                }
              });
            }
          } catch (e) {
            console.error("Erro ao buscar advertências de alunos", e);
          }
        }
      } catch (e: unknown) {
        console.error("Erro ao buscar solicitações", e);
      }
    };
    fetchSolicitacoes();
    interval = setInterval(fetchSolicitacoes, 5000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  console.log('data - ', data)

  return (
    <div className="w-full flex flex-col h-full items-start">
      <p className="text-theme-blue font-semibold text-[1.2rem] w-full text-start">
        Laboratórios em uso
      </p>

      {/* Solicitações Pendentes */}
      {solicitacoes.length > 0 && (
        <div className="w-full bg-theme-container border border-theme-blue/10 rounded-xl p-4 mt-4 shadow-sm">
          <h2 className="text-theme-blue font-semibold text-sm mb-3 flex items-center gap-2">
            🔔 Solicitações de uso pendentes
          </h2>
          <div className="flex flex-col gap-3 max-h-64 overflow-auto pr-2">
            {solicitacoes.map((s) => (
              <div
                key={s.id}
                className="flex items-start justify-between gap-4 bg-white/60 rounded-lg px-3 py-2 border border-theme-blue/10"
              >
                <div className="flex flex-col text-xs">
                  <span className="text-theme-text font-medium">
                    {s.aluno.nome} ({s.aluno.ra})
                  </span>
                  <span className="text-theme-blue font-semibold">
                    Lab {s.laboratorio.numero} - {s.laboratorio.nome}
                  </span>
                  {advertenciasAlunos[s.idAluno] && (
                    <span
                      className="mt-1 inline-block text-[0.6rem] px-2 py-[2px] rounded-full bg-amber-500/90 text-white font-semibold tracking-wide shadow-sm"
                      title="Aluno possui advertências recentes"
                    >
                      Advertência
                    </span>
                  )}
                </div>
                {canAcao && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAprovar(s.id)}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md font-medium transition-colors"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleRecusar(s.id)}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-medium transition-colors"
                    >
                      Recusar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full h-full flex flex-col justify-between">
        <div className="h-full overflow-y-auto rounded-lg bg-theme-white mt-5">
          <table className="h-full min-w-full">
            <thead>
              <tr>
                <th className="status-column px-4 py-3 text-left text-xs font-semibold text-theme-blue uppercase">
                  Status
                </th>
                <th className="laboratorio-column px-4 py-3 text-left text-xs font-semibold text-theme-blue uppercase">
                  Laboratório
                </th>
                <th className="aluno-column px-4 py-3 text-left text-xs font-semibold text-theme-blue uppercase">
                  Aluno
                </th>
                <th className="data-hora-entrada-column px-4 py-3 text-left text-xs font-semibold text-theme-blue uppercase">
                  Data/Hora de Entrada
                </th>
                <th className="acoes-column px-4 py-3 text-center text-xs font-semibold text-theme-blue uppercase">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-[#F5F5F5]" : "bg-white"}
                  >
                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${item.posseChave ? "bg-[#22FF00]" : "bg-theme-lightBlue"
                            }`}
                        ></div>
                        {item.posseChave ? "Com chave" : "Sem chave"}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text">
                      <Popover extendedClass="font-medium" title={item.laboratorio?.nome}>{item.laboratorio?.nome}</Popover>
                    </td>

                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text">
                      <Popover extendedClass="font-medium" title={item.aluno?.nome || "-"}>{item.aluno?.nome || "-"}</Popover>
                    </td>

                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text">
                      <Popover extendedClass="font-medium" title={item.dataHoraEntrada
                        ? new Date(item.dataHoraEntrada).toLocaleString()
                        : "-"}>{item.dataHoraEntrada
                          ? new Date(item.dataHoraEntrada).toLocaleString()
                          : "-"}</Popover>
                    </td>

                    <td className="px-4 py-3 text-[0.8rem] font-medium text-theme-text text-center">
                      {item.id != null && canAcao && (
                        <Popover extendedClass="font-medium" title="Encerrar uso do laboratório">
                          <button
                            onClick={() =>
                              setOpenEncerrar({ status: true, id: item.id! })
                            }
                            className="hover:scale-110 transition-transform"
                          >
                            <DeleteIcon className="text-theme-red" />
                          </button>
                        </Popover>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-center text-sm text-theme-blue font-normal"
                  >
                    Nenhum laboratório em uso no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL DE ENCERRAR */}
        <CustomModal
          open={openEncerrar.status}
          onClose={() => setOpenEncerrar({ status: false, id: 0 })}
          title="Encerrar uso do laboratório"
          message={`Tem certeza que deseja encerrar o empréstimo para ${data.find((item) => item.id === openEncerrar.id)?.aluno.nome
            } no laboratório ${data.find((item) => item.id === openEncerrar.id)?.laboratorio.nome
            }?`}
          onConfirm={async () => {
            try {
              await apiOnline.put(`/emprestimo/close/${openEncerrar.id}`);
              setData(data.filter((item) => item.id !== openEncerrar.id));
              setOpenEncerrar({ status: false, id: 0 });
            } catch (e) {
              console.error(e);
              setOpenEncerrar({ status: false, id: 0 });
            } finally {
              setUpdate(!update);
            }
          }}
          onCancel={() => setOpenEncerrar({ status: false, id: 0 })}
        />

        {/* PAGINAÇÃO */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
