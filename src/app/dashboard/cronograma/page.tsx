"use client";

import { useEffect, useState, useMemo } from "react";
import ProfessorAutocomplete from "@/components/ProfessorAutocomplete";
import Loading from "@/app/loading";
import { apiOnline } from "@/services/services";
import { IHorario, ILaboratorio, IProfessor } from "@/interfaces/interfaces";
import { toast } from "react-toastify";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const horarios = [
  "08:15",
  "09:10",
  "10:05",
  "11:00",
  "13:30",
  "14:20",
  "15:10",
  "16:00",
  "17:05",
  "17:55",
  "18:45",
  "19:40",
  "20:35",
  "21:30",
];

function normalizeHorario(raw?: string): string {
  if (!raw) return "";
  const m = raw.match(/^([0-2]\d:[0-5]\d)/);
  return m ? m[1] : raw;
}

export default function Cronograma() {
  const [activeId, setActiveId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [loadingTabela, setLoadingTabela] = useState(false);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [professores, setProfessores] = useState<IProfessor[]>([]);
  const [tabelas, setTabelas] = useState<Record<number, string[][]>>({});
  const [todosHorarios, setTodosHorarios] = useState<IHorario[]>([]);
  const [salvando, setSalvando] = useState(false);
  // Controle de quais laboratórios já tiveram horários carregados (para Aulas de Hoje)
  const [labsCarregados, setLabsCarregados] = useState<Set<number>>(new Set());
  // Mapa de células editáveis por laboratório (true = existe slot e pode atribuir professor)
  const [editaveis, setEditaveis] = useState<Record<number, boolean[][]>>({});

  const diaSemanaAtual = new Date().getDay();

  // Professores
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const resp = await apiOnline.get<{
          professores?: IProfessor[];
          data?: { professores?: IProfessor[] };
        }>("/professor?ativo=true");
        const dataBlock = (resp as { data?: { professores?: IProfessor[] } })
          ?.data;
        const listaPossivel =
          dataBlock?.professores ??
          (resp as { professores?: IProfessor[] })?.professores;
        const lista: IProfessor[] = Array.isArray(listaPossivel)
          ? listaPossivel
          : [];
        setProfessores(
          [...lista].sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
          )
        );
      } catch (e) {
        console.error("Erro ao buscar professores", e);
        setProfessores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessores();
  }, []);

  // Laboratórios
  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const resp = await apiOnline.get<{
          data?: ILaboratorio[];
          laboratorios?: ILaboratorio[];
        }>("/horario/");
        const lista =
          (resp.data && Array.isArray(resp.data)
            ? resp.data
            : (resp as { laboratorios?: ILaboratorio[] }).laboratorios) || [];
        if (lista.length) setLaboratorios(lista.filter((l) => l?.id != null));
      } catch (e) {
        console.error("Erro ao buscar laboratórios", e);
      }
    };
    fetchLaboratorios();
  }, []);

  // Carrega horários para o laboratório ativo se ainda não carregado (com tabela editável)
  useEffect(() => {
    const carregarHorariosLab = async () => {
      if (!activeId || tabelas[activeId]) return;
      setLoadingTabela(true);
      try {
        const resp = await apiOnline.get<{
          horarios?: IHorario[];
          data?: IHorario[];
        }>(`/horario/laboratorio/${activeId}`);
        const listaRaw: IHorario[] =
          (resp.data && Array.isArray(resp.data) ? resp.data : resp.horarios) ||
          [];
        const lista = listaRaw.map((h) => ({
          ...h,
          horario: normalizeHorario(h.horario),
        }));
        // Dedup global
        setTodosHorarios((prev) => {
          const key = (h: IHorario) =>
            `${h.idLaboratorio}-${h.diaSemana}-${h.horario}`;
          const seen = new Set(prev.map(key));
          const add = lista.filter((h) => h.idLaboratorio && !seen.has(key(h)));
          return add.length ? [...prev, ...add] : prev;
        });
        // Monta tabela ativa e mapa de células editáveis. Agora SOMENTE células com horário existente podem receber professor.
        const matriz = Array.from({ length: horarios.length }, () =>
          Array(dias.length).fill("")
        );
        const matrizEdit = Array.from({ length: horarios.length }, () =>
          Array(dias.length).fill(false)
        );
        lista.forEach((h) => {
          if (!h.horario || h.diaSemana == null) return;
          if (h.diaSemana === 0) return; // domingo ignora
          if (h.diaSemana === 6) {
            const hr = Number(h.horario.split(":")[0]);
            if (hr >= 12) return; // sábado tarde ignora
          }
          const lin = horarios.findIndex((hr) => hr === h.horario);
          if (lin === -1) return;
          const col = h.diaSemana === 6 ? 5 : h.diaSemana - 1;
          if (col < 0 || col >= dias.length) return;
          const nome =
            h.professor?.nome ||
            professores.find((p) => p.id === h.idProfessor)?.nome ||
            "";
          matriz[lin][col] = nome;
          matrizEdit[lin][col] = true; // existe slot, pode editar
        });
        setTabelas((prev) => ({ ...prev, [activeId]: matriz }));
        setEditaveis((prev) => ({ ...prev, [activeId]: matrizEdit }));
        if (activeId) {
          setLabsCarregados((prev) => {
            const novo = new Set(prev);
            novo.add(activeId);
            return novo;
          });
        }
      } catch (e) {
        console.error("Erro ao carregar horários do laboratório", e);
      } finally {
        setLoadingTabela(false);
      }
    };
    carregarHorariosLab();
  }, [activeId, tabelas, professores]);

  // Pré-carrega horários dos demais laboratórios para que apareçam em "Aulas de Hoje" sem precisar selecionar
  useEffect(() => {
    if (!laboratorios.length) return;
    const faltando = laboratorios.filter(
      (l) => l.id != null && !labsCarregados.has(l.id)
    );
    if (!faltando.length) return;
    let cancelado = false;
    (async () => {
      // Evita bloquear: carrega em sequência para reduzir pico de requisições
      for (const lab of faltando) {
        if (cancelado) break;
        try {
          const resp = await apiOnline.get<{
            horarios?: IHorario[];
            data?: IHorario[];
          }>(`/horario/laboratorio/${lab.id}`);
          const listaRaw: IHorario[] =
            (resp.data && Array.isArray(resp.data)
              ? resp.data
              : resp.horarios) || [];
          if (!listaRaw.length) {
            setLabsCarregados((prev) => {
              const n = new Set(prev);
              n.add(lab.id!);
              return n;
            });
            continue;
          }
          const lista = listaRaw.map((h) => ({
            ...h,
            horario: normalizeHorario(h.horario),
          }));
          setTodosHorarios((prev) => {
            const key = (h: IHorario) =>
              `${h.idLaboratorio}-${h.diaSemana}-${h.horario}`;
            const existentes = new Set(prev.map(key));
            const add = lista.filter(
              (h) => h.idLaboratorio && !existentes.has(key(h))
            );
            return add.length ? [...prev, ...add] : prev;
          });
          // Não montamos tabela aqui pois só precisamos saber que slots existem para "Aulas de Hoje". Entretanto, guardamos editáveis caso o usuário selecione depois.
          setEditaveis((prev) => {
            if (!lab.id) return prev;
            if (prev[lab.id]) return prev; // já existe
            const matrizEdit = Array.from({ length: horarios.length }, () =>
              Array(dias.length).fill(false)
            );
            lista.forEach((h) => {
              if (!h.horario || h.diaSemana == null) return;
              if (h.diaSemana === 0) return;
              if (h.diaSemana === 6) {
                const hr = Number(h.horario.split(":")[0]);
                if (hr >= 12) return;
              }
              const lin = horarios.findIndex((hr) => hr === h.horario);
              if (lin === -1) return;
              const col = h.diaSemana === 6 ? 5 : h.diaSemana - 1;
              if (col < 0 || col >= dias.length) return;
              matrizEdit[lin][col] = true;
            });
            return { ...prev, [lab.id]: matrizEdit };
          });
          setLabsCarregados((prev) => {
            const n = new Set(prev);
            n.add(lab.id!);
            return n;
          });
        } catch (e) {
          console.error(
            "Erro ao pré-carregar horários do laboratório",
            lab.id,
            e
          );
          setLabsCarregados((prev) => {
            const n = new Set(prev);
            n.add(lab.id!);
            return n;
          });
        }
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [laboratorios, labsCarregados]);

  // Tabela ativa derivada
  const tabelaAtiva = useMemo(() => {
    if (!tabelas[activeId]) {
      return Array.from({ length: horarios.length }, () =>
        Array(dias.length).fill("")
      );
    }
    return tabelas[activeId];
  }, [tabelas, activeId]);

  const getProfessorNomeById = (id?: number) => {
    if (!id) return undefined;
    return professores.find((p) => p.id === id)?.nome;
  };

  const getLaboratorioNomeById = (id?: number) => {
    if (!id) return undefined;
    const l = laboratorios.find((lab) => lab.id === id);
    if (!l) return undefined;
    return `${l.nome}${l.numero ? ` - ${l.numero}` : ""}`;
  };

  const aulasHoje = useMemo(() => {
    return todosHorarios.filter((h) => {
      if (h.diaSemana !== diaSemanaAtual) return false;
      if (diaSemanaAtual === 6) {
        const horaNum = Number(h.horario.split(":")[0]);
        if (horaNum >= 12) return false;
      }
      return true;
    });
  }, [todosHorarios, diaSemanaAtual]);

  const aulasOrdenadas = useMemo(() => {
    return aulasHoje
      .filter((a) => !!(a.professor?.nome || a.idProfessor))
      .sort((a, b) => a.horario.localeCompare(b.horario, "pt"))
      .map((a) => ({
        id:
          a.id ??
          `${a.diaSemana}-${a.horario}-${a.idLaboratorio}-${a.idProfessor}`,
        horario: a.horario,
        professor:
          a.professor?.nome || getProfessorNomeById(a.idProfessor) || "",
        laboratorio: a.laboratorio?.nome
          ? `${a.laboratorio.nome}${
              a.laboratorio.numero ? ` - ${a.laboratorio.numero}` : ""
            }`
          : getLaboratorioNomeById(a.idLaboratorio) || "",
        idLaboratorio: a.idLaboratorio,
      }));
  }, [aulasHoje, professores, laboratorios]);

  const laboratoriosUnificados = useMemo(() => {
    const map = new Map<number, ILaboratorio>();
    laboratorios.forEach((l) => {
      if (l.id != null) map.set(l.id, l);
    });
    aulasOrdenadas.forEach((a) => {
      if (a.idLaboratorio && !map.has(a.idLaboratorio)) {
        map.set(a.idLaboratorio, {
          id: a.idLaboratorio,
          nome: a.laboratorio.split(" - ")[0] || "Lab",
          numero: a.laboratorio.split(" - ")[1] || "",
          restrito: false,
        } as ILaboratorio);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.id! - b.id!);
  }, [laboratorios, aulasOrdenadas]);

  useEffect(() => {
    if (
      laboratoriosUnificados.length &&
      !laboratoriosUnificados.some((l) => l.id === activeId)
    ) {
      setActiveId(laboratoriosUnificados[0].id!);
    }
  }, [laboratoriosUnificados, activeId]);

  const tabelaAulasHoje = useMemo(() => {
    if (!aulasOrdenadas.length) {
      return {
        horarios: [] as string[],
        laboratorios: [] as { id: number; label: string }[],
        mapa: {} as Record<string, string>,
      };
    }
    const labsMap = new Map<number, string>();
    aulasOrdenadas.forEach((a) => {
      if (!a.idLaboratorio) return;
      const label =
        getLaboratorioNomeById(a.idLaboratorio) ||
        a.laboratorio ||
        `Lab ${a.idLaboratorio}`;
      labsMap.set(a.idLaboratorio, label);
    });
    const labs = Array.from(labsMap.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.id - b.id);
    const hrs = Array.from(new Set(aulasOrdenadas.map((a) => a.horario))).sort(
      (a, b) => a.localeCompare(b)
    );
    const mapa: Record<string, string> = {};
    aulasOrdenadas.forEach((a) => {
      if (!a.idLaboratorio || !a.professor) return;
      const chave = `${normalizeHorario(a.horario)}__${a.idLaboratorio}`;
      mapa[chave] = a.professor;
    });
    return { horarios: hrs, laboratorios: labs, mapa };
  }, [aulasOrdenadas, laboratorios]);

  // Índice do primeiro horário considerado "noite" (>= 18:00)
  const firstNightIndex = useMemo(() => {
    const alvo = horarios.findIndex((h) => {
      const [hh] = h.split(":");
      return Number(hh) >= 18;
    });
    return alvo === -1 ? undefined : alvo;
  }, []);

  // Índice do primeiro horário considerado "tarde" (>= 13:00)
  const firstAfternoonIndex = useMemo(() => {
    const alvo = horarios.findIndex((h) => {
      const [hh] = h.split(":");
      return Number(hh) >= 13; // depois do bloco da manhã
    });
    return alvo === -1 ? undefined : alvo;
  }, []);

  const compactMode = useMemo(
    () => tabelaAulasHoje.laboratorios.length > 6,
    [tabelaAulasHoje.laboratorios]
  );

  // Calcula, especificamente para a tabela "Aulas de Hoje", qual a primeira hora da noite presente
  // e se há pelo menos um horário da tarde. Isso permite inserir o separador noite mesmo quando
  // o horário pivot (ex: 18:45) não está listado entre as aulas do dia.
  const separadoresHoje = useMemo(() => {
    const horas = tabelaAulasHoje.horarios;
    let primeiraTarde: string | undefined;
    let primeiraNoite: string | undefined;
    let hasAfternoon = false;
    let hasMorning = false;
    for (const h of horas) {
      const hh = Number(h.split(":")[0]);
      if (hh < 12) hasMorning = true; // manhã (até 11:59)
      if (hh >= 13 && hh < 18) {
        hasAfternoon = true; // tarde
        if (primeiraTarde === undefined) primeiraTarde = h;
      }
      if (hh >= 18 && primeiraNoite === undefined) primeiraNoite = h; // noite
    }
    // Separador noite: existe noite e (existe tarde ou (não existe tarde mas existe manhã))
    const precisaSeparadorNoite = !!(
      primeiraNoite && (hasAfternoon || (!hasAfternoon && hasMorning))
    );
    // Separador tarde: existe tarde e existe manhã e primeiraTarde definida
    const precisaSeparadorTarde = !!(
      hasMorning && hasAfternoon && primeiraTarde
    );
    return {
      hasAfternoon,
      hasMorning,
      primeiraNoite,
      primeiraTarde,
      precisaSeparadorNoite,
      precisaSeparadorTarde,
    };
  }, [tabelaAulasHoje.horarios]);

  const dadosIncompletos = useMemo(
    () =>
      laboratoriosUnificados.some(
        (l) => l.id != null && !labsCarregados.has(l.id!)
      ),
    [laboratoriosUnificados, labsCarregados]
  );

  const dataHojeFormatada = useMemo(
    () =>
      new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    []
  );

  const atualizarCelula = (linha: number, coluna: number, valor: string) => {
    setTabelas((prev) => {
      const copia = { ...prev };
      const tabela = copia[activeId]
        ? copia[activeId].map((l) => [...l])
        : Array.from({ length: horarios.length }, () =>
            Array(dias.length).fill("")
          );
      tabela[linha][coluna] = valor;
      copia[activeId] = tabela;
      return copia;
    });
  };

  const salvarTabela = async () => {
    if (salvando) return;
    setSalvando(true);
    try {
      const colunaParaDiaSemana = (col: number) => (col === 5 ? 6 : col + 1);
      const nomeParaProfessorId = (nome: string): number | undefined => {
        const normalizado = nome.trim().toLocaleLowerCase("pt");
        if (!normalizado) return undefined;
        return professores.find(
          (p) => p.nome.trim().toLocaleLowerCase("pt") === normalizado
        )?.id;
      };
      const orig = todosHorarios.filter((h) => h.idLaboratorio === activeId);
      const chaveMap = (dia: number, horario: string) => `${dia}-${horario}`;
      const mapaOrig = new Map<string, IHorario>(
        orig.map((h) => [chaveMap(h.diaSemana, h.horario), h])
      );
      const updates: { id: number; idProfessor: number }[] = [];
      const desconhecidos: string[] = [];
      // Como não criamos mais novos horários, apenas atualizamos ou limpamos.
      const removidos: { id: number; diaSemana: number; horario: string }[] =
        [];

      tabelaAtiva.forEach((linhaValores, idxLinha) => {
        const horario = horarios[idxLinha];
        linhaValores.forEach((valor, col) => {
          const nome = valor.trim();
          const diaSemana = colunaParaDiaSemana(col);
          const key = chaveMap(diaSemana, horario);
          const original = mapaOrig.get(key);
          if (!nome) {
            if (original?.idProfessor) {
              removidos.push({ id: original.id!, diaSemana, horario });
            }
            return;
          }
          const idProfessor = nomeParaProfessorId(nome);
          if (!idProfessor) {
            if (!desconhecidos.includes(nome)) desconhecidos.push(nome);
            return;
          }
          if (original?.id && original.idProfessor !== idProfessor) {
            updates.push({ id: original.id, idProfessor });
          }
        });
      });

      if (!updates.length && !removidos.length) {
        toast.info("Nenhuma alteração para salvar.");
        return;
      }
      if (desconhecidos.length) {
        toast.warning(
          `Professores não reconhecidos ignorados: ${desconhecidos.join(", ")}`
        );
      }
      let ok = 0;
      let fail = 0;
      for (const u of updates) {
        try {
          await apiOnline.put(`/horario/${u.id}`, {
            idProfessor: u.idProfessor,
          });
          ok++;
        } catch (e) {
          console.error("Falha ao atualizar", u, e);
          fail++;
        }
      }
      if (ok) {
        const mapProf = new Map<number, IProfessor>();
        professores.forEach((p) => p.id != null && mapProf.set(p.id, p));
        setTodosHorarios((prev) =>
          prev.map((h) => {
            const up = updates.find((u) => u.id === h.id);
            if (up) {
              return {
                ...h,
                idProfessor: up.idProfessor,
                professor: mapProf.get(up.idProfessor),
              };
            }
            return h;
          })
        );
      }
      // Limpeza (idProfessor: null)
      let okRem = 0;
      for (const r of removidos) {
        try {
          await apiOnline.put(`/horario/${r.id}`, { idProfessor: null });
          okRem++;
        } catch (e) {
          console.error("Falha ao limpar horário", r, e);
          fail++;
        }
      }

      if (okRem) {
        setTodosHorarios((prev) =>
          prev.map((h) => {
            const rem = removidos.find((r) => r.id === h.id);
            if (rem) {
              return {
                ...h,
                idProfessor: undefined as unknown as number,
                professor: undefined,
              };
            }
            return h;
          })
        );
      }
      if (fail && (ok || okRem))
        toast.warn(`Atualizados ${ok}, limpos ${okRem}, falharam ${fail}.`);
      else if (fail) toast.error("Falha ao salvar alterações.");
      else toast.success(`Salvo ${ok} atualização(ões) e ${okRem} limpeza(s).`);
    } catch (e) {
      console.error("Erro ao salvar cronograma", e);
      toast.error("Erro inesperado ao salvar.");
    } finally {
      setSalvando(false);
    }
  };

  const isTabelaVazia = useMemo(() => {
    const matrizEdit = editaveis[activeId];
    if (!matrizEdit) return true;
    for (let i = 0; i < tabelaAtiva.length; i++) {
      for (let j = 0; j < tabelaAtiva[i].length; j++) {
        if (matrizEdit[i]?.[j] && tabelaAtiva[i][j].trim() !== "") return false;
      }
    }
    return true;
  }, [tabelaAtiva, editaveis, activeId]);

  // Inicializa tabela vazia se seleciona laboratório ainda não carregado
  useEffect(() => {
    if (activeId && !tabelas[activeId]) {
      setTabelas((prev) => ({
        ...prev,
        [activeId]: Array.from({ length: horarios.length }, () =>
          Array(dias.length).fill("")
        ),
      }));
    }
  }, [activeId, tabelas]);

  if (loading) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Estilo global para garantir que as opções do select fiquem visíveis (evita texto branco em fundo branco no dropdown nativo) */}
      <style>{`
        select#labSelect option { color: #0f172a; background: #ffffff; }
        select#labSelect option:disabled { color: #64748b; }
        select#labSelect optgroup { color:#0f172a; background:#ffffff; }
      `}</style>
      {/* Aulas de Hoje */}
      <div className="w-full flex flex-col">
        <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
          Aulas de Hoje
        </p>
        <div className="flex-1 rounded-[10px] border-2 border-dashed border-theme-blue/40 p-4 text-sm leading-relaxed mb-6 bg-gradient-to-br from-theme-blue/5 via-theme-blue/0 to-theme-blue/5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="text-theme-blue font-medium capitalize">
              {dataHojeFormatada}
            </span>
            <span className="text-[0.65rem] px-2 py-1 rounded-full bg-theme-blue text-theme-white font-semibold tracking-wide">
              {aulasOrdenadas.length}{" "}
              {aulasOrdenadas.length === 1 ? "aula" : "aulas"}
            </span>
            {dadosIncompletos && (
              <span
                className="text-[0.6rem] px-2 py-1 rounded-full bg-amber-500 text-white font-semibold tracking-wide"
                title="Nem todos os laboratórios tiveram seus horários carregados; visão potencialmente parcial."
              >
                Parcial
              </span>
            )}
          </div>
          {tabelaAulasHoje.horarios.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-theme-blue/60 py-6">
              <p className="font-medium mb-1">
                Nenhuma aula com professor cadastrada para hoje
              </p>
              <p className="text-[0.7rem] max-w-[240px] leading-snug">
                Adicione professores às aulas ou cadastre novas para
                visualizá-las aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className={`min-w-full border-separate border-spacing-0 text-[0.65rem] ${
                  compactMode ? "table-fixed" : ""
                }`}
              >
                <thead>
                  <tr>
                    <th
                      className={`sticky left-0 z-20 bg-theme-blue text-theme-white font-semibold ${
                        compactMode ? "px-2 w-[70px]" : "px-3 w-[110px]"
                      } py-2 text-left rounded-l-md border border-theme-blue/20`}
                    >
                      Horário
                    </th>
                    {tabelaAulasHoje.laboratorios.map((labObj) => (
                      <th
                        key={labObj.id}
                        className={`bg-theme-blue text-theme-white font-semibold ${
                          compactMode ? "px-2 py-2 text-[0.6rem]" : "px-3 py-2"
                        } text-left border border-theme-blue/20 ${
                          compactMode ? "min-w-[90px]" : "min-w-[140px]"
                        } whitespace-nowrap`}
                      >
                        {labObj.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tabelaAulasHoje.horarios.map((hora, idxHora) => {
                    // Separador noite agora baseado na primeira hora de noite realmente presente no dia
                    const isNightSeparator =
                      separadoresHoje.precisaSeparadorNoite &&
                      separadoresHoje.primeiraNoite === hora &&
                      idxHora !== 0; // evita separador no topo
                    // Separador tarde agora dinâmico: antes da primeira hora efetiva da tarde presente
                    const isAfternoonSeparator =
                      separadoresHoje.precisaSeparadorTarde &&
                      separadoresHoje.primeiraTarde === hora &&
                      idxHora !== 0;
                    return (
                      <>
                        {isAfternoonSeparator && (
                          <tr key={hora + "_sep_tarde"}>
                            <td
                              colSpan={1 + tabelaAulasHoje.laboratorios.length}
                              className="bg-gradient-to-r from-transparent via-amber-300/40 to-transparent h-[6px] p-0"
                              title="Intervalo"
                            />
                          </tr>
                        )}
                        {isNightSeparator && (
                          <tr key={hora + "_sep"}>
                            <td
                              colSpan={1 + tabelaAulasHoje.laboratorios.length}
                              className="bg-gradient-to-r from-transparent via-theme-blue/20 to-transparent h-[6px] p-0"
                              title="Intervalo"
                            />
                          </tr>
                        )}
                        <tr
                          key={hora}
                          className={
                            idxHora % 2 === 0 ? "bg-theme-blue/5" : "bg-white"
                          }
                        >
                          <td
                            className={`sticky left-0 z-10 bg-theme-blue/90 text-theme-white font-semibold ${
                              compactMode ? "px-2" : "px-3"
                            } py-2 border border-theme-blue/20 whitespace-nowrap`}
                          >
                            {hora}
                          </td>
                          {tabelaAulasHoje.laboratorios.map((labObj) => {
                            const chave = `${hora}__${labObj.id}`;
                            const professor = tabelaAulasHoje.mapa[chave];
                            return (
                              <td
                                key={labObj.id + "_" + hora}
                                className={`border border-theme-blue/15 align-top ${
                                  compactMode
                                    ? "px-1 py-1 text-[0.55rem]"
                                    : "px-2 py-1"
                                } ${
                                  compactMode ? "min-w-[90px]" : "min-w-[140px]"
                                }`}
                              >
                                {professor ? (
                                  <div className="flex flex-col gap-1">
                                    <span
                                      className="font-bold text-theme-blue truncate"
                                      title={professor}
                                    >
                                      {professor}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-theme-blue/30 select-none">
                                    —
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Cronograma editável */}
      <div className="w-full flex flex-col">
        <div className="w-full h-9/10 flex flex-col mb-4 gap-3">
          <p className="font-semibold text-[1.2rem] text-theme-blue">
            📅 Cronograma de aulas
          </p>
          <div className="w-full max-w-xs">
            <label className="sr-only" htmlFor="labSelect">
              Laboratório
            </label>
            <select
              id="labSelect"
              className="w-full h-12 px-4 rounded-[12px] font-semibold text-theme-white bg-gradient-to-r from-theme-blue to-theme-lightBlue border-2 border-theme-lightBlue shadow-md focus:outline-none focus:ring-4 focus:ring-theme-lightBlue/50 hover:from-theme-blue/90 hover:to-theme-lightBlue/90 transition-colors cursor-pointer"
              value={activeId || ""}
              onChange={(e) => setActiveId(Number(e.target.value))}
              disabled={
                !Array.isArray(laboratoriosUnificados) ||
                !laboratoriosUnificados.length
              }
            >
              <option value="" disabled>
                {laboratoriosUnificados.length
                  ? "Selecione um laboratório"
                  : "Carregando..."}
              </option>
              {laboratoriosUnificados.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.nome} - {lab.numero}
                </option>
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
              {horarios.map((hora, linha) => {
                const isNightSeparator =
                  firstNightIndex !== undefined &&
                  linha === firstNightIndex &&
                  linha !== 0;
                const isAfternoonSeparator =
                  firstAfternoonIndex !== undefined &&
                  linha === firstAfternoonIndex &&
                  linha !== 0;
                return (
                  <>
                    {isAfternoonSeparator && (
                      <tr key={linha + "_sep_tarde"}>
                        <td
                          colSpan={1 + dias.length}
                          className="bg-gradient-to-r from-transparent via-amber-300/40 to-transparent h-[6px] p-0"
                          title="Intervalo"
                        />
                      </tr>
                    )}
                    {isNightSeparator && (
                      <tr key={linha + "_sep_noite"}>
                        <td
                          colSpan={1 + dias.length}
                          className="bg-gradient-to-r from-transparent via-theme-blue/20 to-transparent h-[6px] p-0"
                          title="Intervalo"
                        />
                      </tr>
                    )}
                    <tr key={linha}>
                      <td className="border border-gray-400 px-2 py-1 font-bold bg-theme-blue text-theme-white text-center w-[90px]">
                        {hora}
                      </td>
                      {dias.map((_, coluna) => {
                        const isSabado = coluna === 5;
                        const horaNum = Number(hora.split(":")[0]);
                        const sabadoBloqueado = isSabado && horaNum >= 12;
                        const podeEditar =
                          !!editaveis[activeId]?.[linha]?.[coluna];
                        if (sabadoBloqueado || !podeEditar) {
                          return (
                            <td
                              key={coluna}
                              className="border border-gray-400 p-0 w-[120px] bg-gray-100/60 text-center text-[0.55rem] text-gray-400 align-middle select-none"
                              title={
                                sabadoBloqueado
                                  ? "Sábado somente período da manhã"
                                  : !podeEditar
                                  ? "Horário não disponível para edição"
                                  : undefined
                              }
                            >
                              —
                            </td>
                          );
                        }
                        return (
                          <td
                            key={coluna}
                            className="border border-gray-400 p-0 w-[120px] relative"
                          >
                            {loadingTabela && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[0.55rem] text-theme-blue animate-pulse z-10">
                                Carregando...
                              </div>
                            )}
                            <ProfessorAutocomplete
                              value={tabelaAtiva[linha][coluna]}
                              onChange={(val) =>
                                atualizarCelula(linha, coluna, val)
                              }
                              professores={professores}
                              disabled={loadingTabela}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="w-full flex items-center justify-end mt-4">
          <button
            type="button"
            onClick={salvarTabela}
            disabled={isTabelaVazia || salvando}
            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] ${
              isTabelaVazia || salvando ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
