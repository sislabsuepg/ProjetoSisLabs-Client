"use client";

import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { apiOnline } from "@/services/services";
import { IHorario, ILaboratorio } from "@/interfaces/interfaces";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const horarios = [
  "08:00","09:00","10:00","11:00","12:00","13:30","14:30","15:30","16:30","17:30",
  "18:30","19:30","20:30","21:30","22:30"
];

export default function Cronograma() {
  const [activeId, setActiveId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [aulasHoje, setAulasHoje] = useState<IHorario[]>([]);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [tabelas, setTabelas] = useState<{ [id: number]: string[][] }>({ 0: [[]] });
  const [editando, setEditando] = useState<{ linha: number; coluna: number } | null>(null);
  const [valorTemp, setValorTemp] = useState("");
  const tabelaAtiva = tabelas[activeId];
  const hoje = new Date().getDay();

  useEffect(() => {
    const buscaHoje = async () => {
      setLoading(true);
      const dados = await apiOnline.get<IHorario[]>(`horario/dia/${hoje}`);
      setAulasHoje(dados);
      setLoading(false);
    };
    buscaHoje();
  }, []);

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

  const handleClickCelula = (linha: number, coluna: number) => {
    setEditando({ linha, coluna });
    setValorTemp(tabelaAtiva[linha][coluna]);
  };

  const salvarEdicao = () => {
    if (editando) {
      const novaTabela = [...tabelaAtiva];
      novaTabela[editando.linha][editando.coluna] = valorTemp;
      setTabelas(prev => ({
        ...prev,
        [activeId]: novaTabela
      }));
      setEditando(null);
    }
  };

  const cancelarEdicao = () => {
    setEditando(null);
  };

  const salvarTabela = () => {
    console.log("Cronograma salvo:", tabelaAtiva);
  };

  const isTabelaVazia = true;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full flex gap-8">
      {/* Coluna Esquerda */}
      <div className="w-1/3 flex flex-col">
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
      <div className="w-2/3 flex flex-col">
        <div className="w-full flex flex-col mb-4 gap-3">
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
                    editando?.linha === linha && editando?.coluna === coluna ? (
                      <td key={coluna} className="border border-gray-400 p-0 cursor-pointer w-[120px]">
                        <div className="flex flex-col p-1">
                          <textarea
                            value={valorTemp}
                            onChange={(e) => setValorTemp(e.target.value)}
                            className="w-full font-normal leading-4 h-[50px] p-1 text-center bg-transparent resize-none focus:outline-none"
                          />
                          <div className="flex justify-center gap-2 mt-1">
                            <button onClick={salvarEdicao} className="bg-theme-green font-normal text-white px-2 rounded">OK</button>
                            <button onClick={cancelarEdicao} className="bg-theme-red font-normal text-white px-2 rounded">Cancelar</button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td
                        key={coluna}
                        className="hover:bg-theme-lightBlue hover:text-theme-white border border-gray-400 p-0 cursor-pointer w-[120px]"
                        onClick={() => handleClickCelula(linha, coluna)}
                      >
                        <div className="h-full w-full text-center leading-4 flex items-center justify-center font-normal p-1">
                          {/* {tabelaAtiva[linha][coluna] || "Aula"} */}
                        </div>
                      </td>
                    )
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
