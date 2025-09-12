"use client";

import { useEffect, useState, useMemo } from "react";
import ProfessorAutocomplete from "@/components/ProfessorAutocomplete";
import Loading from "@/app/loading";
import { apiOnline } from "@/services/services";
import { ILaboratorio, IProfessor } from "@/interfaces/interfaces";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const horarios = [
  "08:00","09:00","10:00","11:00","12:00","13:30","14:30","15:30","16:30","17:30",
  "18:30","19:30","20:30","21:30","22:30"
];

export default function Cronograma() {
  const [activeId, setActiveId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [professores, setProfessores] = useState<IProfessor[]>([]);
  const [tabelas, setTabelas] = useState<{ [id: number]: string[][] }>({});
  const tabelaAtiva = useMemo(() => {
    // Gera matriz horarios x dias (linhas = horarios, colunas = dias)
    if (!tabelas[activeId]) {
      return Array.from({ length: horarios.length }, () => Array(dias.length).fill(""));
    }
    return tabelas[activeId];
  }, [tabelas, activeId]);

  useEffect(() => {
    const buscaProfessores = async () => {
      setLoading(true);
      try {
        const resp = await apiOnline.get<{ professores: IProfessor[] }>("/professor?ativo=true");
        const lista = (resp as unknown as { data?: { professores?: IProfessor[] } }).data?.professores || [];
        const ordenada = Array.isArray(lista)
          ? [...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }))
          : [];
        setProfessores(ordenada);
      } catch (e) {
        console.error('Erro ao buscar professores', e);
        setProfessores([]);
      } finally {
        setLoading(false);
      }
    };
    buscaProfessores();
  }, []);


  // Futuro: buscar aulas do dia selecionado

  useEffect(() => {
    interface WithData<T> { data: T }
    const hasDataArray = (val: unknown): val is WithData<ILaboratorio[]> => {
      return typeof val === 'object' && val !== null && Array.isArray((val as { data?: unknown }).data);
    };
    const buscaHorarios = async () => {
      try {
        setLoading(true);
        const dados = await apiOnline.get<unknown>(`/laboratorio?restrito=false`);
        if (Array.isArray(dados)) {
          setLaboratorios(dados as ILaboratorio[]);
        } else if (hasDataArray(dados)) {
          setLaboratorios(dados.data);
        } else {
          console.warn('Resposta inesperada para laboratorios:', dados);
          setLaboratorios([]);
        }
      } catch (e) {
        console.error('Erro ao buscar laboratorios', e);
        setLaboratorios([]);
      } finally {
        setLoading(false);
      }
    };
    buscaHorarios();
  }, []);

  const atualizarCelula = (linha: number, coluna: number, valor: string) => {
    setTabelas(prev => {
      const copia = { ...prev };
      const tabela = copia[activeId]
        ? copia[activeId].map(l => [...l])
        : Array.from({ length: horarios.length }, () => Array(dias.length).fill(""));
      tabela[linha][coluna] = valor;
      copia[activeId] = tabela;
      return copia;
    });
  };

  const salvarTabela = () => {
    console.log("Cronograma salvo:", tabelaAtiva);
  };

  const isTabelaVazia = useMemo(() => {
    return tabelaAtiva.every(linha => linha.every(c => c.trim() === ""));
  }, [tabelaAtiva]);

  // Garante que ao selecionar um laboratório ainda não inicializado, a tabela seja persistida no estado
  useEffect(() => {
    if (activeId && !tabelas[activeId]) {
      setTabelas(prev => ({
        ...prev,
        [activeId]: Array.from({ length: horarios.length }, () => Array(dias.length).fill(""))
      }));
    }
  }, [activeId, tabelas, horarios.length]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-2/5 flex-col gap-8">
      {/* Coluna Esquerda */}
      <div className="w-full h-full flex flex-col">
        <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
          Aulas de Hoje
        </p>
        <div className="flex-1 rounded-[10px] border-2 border-dashed border-theme-blue/40 p-4 text-theme-blue/70 text-sm leading-relaxed mb-6">
          <p className="font-medium mb-2">(Placeholder)</p>
          <p>
            Área para exibir as aulas do dia selecionado / laboratório. Conteúdo
            ainda não implementado. Substituir este bloco futuramente.
          </p>
        </div>
      </div>

      {/* Coluna Direita */}
      <div className="w-full flex flex-col">
        <div className="w-full h-9/10 flex flex-col mb-4 gap-3">
          <p className="font-semibold text-[1.2rem] text-theme-blue">
            📅 Cronograma de aulas
          </p>
          <div className="w-full max-w-xs">
            <label className="sr-only" htmlFor="labSelect">Laboratório</label>
            <select
              id="labSelect"
              className="w-full h-12 px-4 rounded-[10px] font-semibold text-theme-white bg-theme-blue focus:outline-none focus:ring-2 focus:ring-theme-lightBlue cursor-pointer"
              value={activeId || ""}
              onChange={(e)=> setActiveId(Number(e.target.value))}
              disabled={!Array.isArray(laboratorios) || !laboratorios.length}
            >
              <option value="" disabled>{Array.isArray(laboratorios) && laboratorios.length ? "Selecione um laboratório" : "Carregando..."}</option>
              {Array.isArray(laboratorios) && laboratorios.map(lab => (
          <option key={lab.id} value={lab.id}>{lab.nome} - {lab.numero}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-theme-blue">
              <tr>
                <th className="border border-gray-400 text-theme-white px-2 py-1 w-[90px] text-center">
                  Horário
                </th>
                {dias.map((dia, i) => (
                  <th
                    key={i}
                    className="border text-theme-white border-gray-400 px-2 py-1 w-[120px] text-center"
                  >
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horarios.map((hora, linha) => (
                <tr key={linha}>
                  <td className="border border-gray-400 px-2 py-1 font-bold bg-theme-blue text-theme-white text-center w-[90px]">
                    {hora}
                  </td>
                  {dias.map((_, coluna) => (
                    <td key={coluna} className="border border-gray-400 p-0 w-[120px]">
                      <ProfessorAutocomplete
                        value={tabelaAtiva[linha][coluna]}
                        onChange={(val) => atualizarCelula(linha, coluna, val)}
                        professores={professores}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex items-center justify-end mt-4">
          <button
            type="button"
            onClick={salvarTabela}
            disabled={isTabelaVazia}
            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px]
            ${isTabelaVazia ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
