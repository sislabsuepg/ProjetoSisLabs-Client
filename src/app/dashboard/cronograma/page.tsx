"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import ProfessorAutocomplete from "@/components/ProfessorAutocomplete";
import Loading from "@/app/loading";
import { apiOnline } from "@/services/services";
import { IHorario, ILaboratorio, IProfessor } from "@/interfaces/interfaces";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import CustomModal from "@/components/CustomModal";
import { IEvento } from "@/components/Lists/types";
import { canExecuteAction } from "@/utils/permissions";

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
  const [todosEventos, setTodosEventos] = useState<IEvento[]>([]);
  const [salvando, setSalvando] = useState(false);
  // Controle de quais laboratórios já tiveram horários carregados (para Aulas de Hoje)
  const [labsCarregados, setLabsCarregados] = useState<Set<number>>(new Set());
  // Mapa de células editáveis por laboratório (true = existe slot e pode atribuir professor)
  const [editaveis, setEditaveis] = useState<Record<number, boolean[][]>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [cookies] = useCookies(["usuario"]);
  const canEditCronograma = canExecuteAction("editar-cronograma", cookies);
  // Refs para overlay de eventos (Aulas de Hoje)
  const overlayWrapperRef = useRef<HTMLDivElement | null>(null);
  const thRefs = useRef<Record<number, HTMLTableCellElement | null>>({});
  const rowRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const [eventOverlays, setEventOverlays] = useState<
    Array<{
      key: string;
      left: number;
      width: number;
      top: number;
      height: number;
      nome: string;
      responsavel?: string;
      hora: string;
    }>
  >([]);

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
            a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" }),
          ),
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

  // Eventos
  useEffect(() => {
    const carregaEventos = async () => {
      try {
        const resp = await apiOnline.get<{
          eventos?: IEvento[];
          data?: { eventos?: IEvento[] };
        }>("/evento/");
        const lista =
          (resp.data && Array.isArray(resp.data)
            ? resp.data
            : (resp as { eventos?: IEvento[] }).eventos) || [];
        const agora = new Date();
        const hojeLocal = new Date(
          agora.getFullYear(),
          agora.getMonth(),
          agora.getDate(),
        );
        const hojeFimLocal = new Date(
          agora.getFullYear(),
          agora.getMonth(),
          agora.getDate(),
          23,
          59,
          59,
          999,
        );
        const hojeIsoLocal = `${agora.getFullYear()}-${String(
          agora.getMonth() + 1,
        ).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`;
        const filtrados = lista.filter((e) => {
          const dataRaw = typeof e.data === "string" ? e.data.slice(0, 10) : "";
          if (dataRaw === hojeIsoLocal) return true;
          const evento = new Date(e.data);
          return evento >= hojeLocal && evento <= hojeFimLocal;
        });
        setTodosEventos(filtrados);
      } catch (e) {
        console.error("Erro ao buscar eventos", e);
      }
    };
    carregaEventos();
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
          Array(dias.length).fill(""),
        );
        const matrizEdit = Array.from({ length: horarios.length }, () =>
          Array(dias.length).fill(false),
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
      (l) => l.id != null && !labsCarregados.has(l.id),
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
              (h) => h.idLaboratorio && !existentes.has(key(h)),
            );
            return add.length ? [...prev, ...add] : prev;
          });
          // Não montamos tabela aqui pois só precisamos saber que slots existem para "Aulas de Hoje". Entretanto, guardamos editáveis caso o usuário selecione depois.
          setEditaveis((prev) => {
            if (!lab.id) return prev;
            if (prev[lab.id]) return prev; // já existe
            const matrizEdit = Array.from({ length: horarios.length }, () =>
              Array(dias.length).fill(false),
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
            e,
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
        Array(dias.length).fill(""),
      );
    }
    return tabelas[activeId];
  }, [tabelas, activeId]);

  const getProfessorNomeById = (id?: number) => {
    if (!id) return undefined;
    return professores.find((p) => p.id === id)?.nome;
  };

  // Utils para normalização/comparação de nomes e resolução de ID por nome
  const normalizeStr = (s?: string) =>
    (s || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const nomeParaProfessorId = (nome: string): number | undefined => {
    const normalizado = normalizeStr(nome);
    if (!normalizado) return undefined;
    return professores.find((p) => normalizeStr(p.nome) === normalizado)?.id;
  };

  const colunaParaDiaSemana = (col: number) => (col === 5 ? 6 : col + 1);

  const getLaboratorioNomeById = (id?: number) => {
    if (!id) return undefined;
    const l = laboratorios.find((lab) => lab.id === id);
    if (!l) return undefined;
    // Número primeiro
    const numero = (l.numero || "").trim();
    const nome = (l.nome || "").trim();
    return numero ? `${numero} - ${nome}` : nome;
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
        professorId: a.idProfessor,
        // Sigla primeiro quando houver dados do laboratório
        laboratorio: a.laboratorio?.nome
          ? `${(a.laboratorio.numero || "").trim()} - ${(
              a.laboratorio.nome || ""
            ).trim()}`
          : getLaboratorioNomeById(a.idLaboratorio) || "",
        idLaboratorio: a.idLaboratorio,
      }));
  }, [aulasHoje, professores, laboratorios]);

  // Helpers de tempo por slot da grade (ex.: 08:15-09:05, etc.)
  const toMin = (h: string) => {
    const [hh, mm] = h.split(":").map(Number);
    return hh * 60 + mm;
  };
  const slotStarts = useMemo(() => horarios.map(toMin), []);
  const slotEndAt = (idx: number) => {
    // Define fim de cada bloco; assume duração até o início do próximo ou +55min (aprox.) no último
    if (idx < horarios.length - 1) return toMin(horarios[idx + 1]);
    return toMin(horarios[idx]) + 55;
  };
  const firstSlotStart = slotStarts[0] ?? 0;
  const lastSlotStart = slotStarts[slotStarts.length - 1] ?? 0;

  const getEventoLabLabel = (ev: IEvento) => {
    if (ev.idLaboratorio) {
      const fromLabs = getLaboratorioNomeById(ev.idLaboratorio);
      if (fromLabs) return fromLabs;
    }
    const sigla = (ev.laboratorio?.numero || "").trim();
    const nome = (ev.laboratorio?.nome || "").trim();
    if (sigla && nome) return `${sigla} - ${nome}`;
    if (nome) return nome;
    return ev.idLaboratorio ? `Lab ${ev.idLaboratorio}` : "Laboratório não informado";
  };

  const eventosForaGrade = useMemo(() => {
    return todosEventos
      .filter((ev) => {
        const dt = new Date(ev.data);
        const startMin = dt.getHours() * 60 + dt.getMinutes();
        return startMin < firstSlotStart || startMin > lastSlotStart;
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [todosEventos, firstSlotStart, lastSlotStart]);

  const eventosDentroGrade = useMemo(() => {
    return todosEventos.filter((ev) => {
      const dt = new Date(ev.data);
      const startMin = dt.getHours() * 60 + dt.getMinutes();
      return startMin >= firstSlotStart && startMin <= lastSlotStart;
    });
  }, [todosEventos, firstSlotStart, lastSlotStart]);

  const laboratoriosUnificados = useMemo(() => {
    const map = new Map<number, ILaboratorio>();
    laboratorios.forEach((l) => {
      if (l.id != null) map.set(l.id, l);
    });
    aulasOrdenadas.forEach((a) => {
      if (a.idLaboratorio && !map.has(a.idLaboratorio)) {
        map.set(a.idLaboratorio, {
          id: a.idLaboratorio,
          // Agora o formato é "sigla - nome"
          numero: a.laboratorio.split(" - ")[0] || "",
          nome: a.laboratorio.split(" - ")[1] || "Lab",
          restrito: false,
        } as ILaboratorio);
      }
    });
    // Ordena por sigla (numero) e depois por nome
    return Array.from(map.values()).sort((a, b) => {
      const an = (a.numero || "").toString().toLowerCase();
      const bn = (b.numero || "").toString().toLowerCase();
      const cmp = an.localeCompare(bn, "pt", { sensitivity: "base" });
      if (cmp !== 0) return cmp;
      return (a.nome || "").localeCompare(b.nome || "", "pt", {
        sensitivity: "base",
      });
    });
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
    if (!aulasOrdenadas.length && !todosEventos.length) {
      return {
        horarios: [] as string[],
        laboratorios: [] as { id: number; label: string }[],
        mapa: {} as Record<string, string>,
      };
    }
    // Laboratórios presentes em aulas e eventos
    const labsMap = new Map<number, string>();
    aulasOrdenadas.forEach((a) => {
      if (!a.idLaboratorio) return;
      const label =
        getLaboratorioNomeById(a.idLaboratorio) ||
        a.laboratorio ||
        `Lab ${a.idLaboratorio}`;
      labsMap.set(a.idLaboratorio, label);
    });
    todosEventos.forEach((ev) => {
      if (!ev.idLaboratorio) return;
      const label = getEventoLabLabel(ev);
      if (!labsMap.has(ev.idLaboratorio)) labsMap.set(ev.idLaboratorio, label);
    });
    const labs = Array.from(labsMap.entries())
      .map(([id, rawLabel]) => {
        const l = laboratorios.find((x) => x.id === id);
        const sigla = (l?.numero || "").trim();
        const nome = (l?.nome || "").trim();
        const label =
          sigla || nome
            ? sigla
              ? `${sigla} - ${nome}`
              : nome
            : rawLabel;
        return { id, label, sigla: sigla || rawLabel.split(" - ")[0] || "" };
      })
      .sort((a, b) =>
        (a.sigla || "").localeCompare(b.sigla || "", "pt", {
          sensitivity: "base",
        }),
      )
      .map(({ id, label }) => ({ id, label }));

    // Horários (linhas) presentes em aulas ou que tenham interseção com algum evento
    const horasSet = new Set<string>();
    aulasOrdenadas.forEach((a) => horasSet.add(normalizeHorario(a.horario)));
    if (eventosDentroGrade.length) {
      for (let i = 0; i < horarios.length; i++) {
        const s = slotStarts[i];
        const e = slotEndAt(i);
        const intersects = eventosDentroGrade.some((ev) => {
          const dt = new Date(ev.data);
          const evStart = dt.getHours() * 60 + dt.getMinutes();
          const dur =
            typeof ev.duracao === "number" && ev.duracao > 0 ? ev.duracao : 1;
          const evEnd = evStart + dur;
          return Math.max(s, evStart) < Math.min(e, evEnd);
        });
        if (intersects) horasSet.add(horarios[i]);
      }
    }
    const idxMap = new Map(horarios.map((h, i) => [h, i] as const));
    const hrs = Array.from(horasSet.values()).sort(
      (a, b) => idxMap.get(a)! - idxMap.get(b)!,
    );

    // Mapa de aulas (professor por chave horario__lab)
    const mapa: Record<string, string> = {};
    aulasOrdenadas.forEach((a) => {
      if (!a.idLaboratorio || !a.professor) return;
      const chave = `${normalizeHorario(a.horario)}__${a.idLaboratorio}`;
      mapa[chave] = a.professor;
    });
    return { horarios: hrs, laboratorios: labs, mapa };
  }, [aulasOrdenadas, laboratorios, todosEventos, eventosDentroGrade, slotStarts]);

  // (removido) Index de eventos por lab não é necessário com overlay absoluto

  // Calcula posições absolutas para sobrepor os eventos acima das células
  useEffect(() => {
    const wrapper = overlayWrapperRef.current;
    if (!wrapper) return;
    if (
      !tabelaAulasHoje.horarios.length ||
      !tabelaAulasHoje.laboratorios.length
    ) {
      setEventOverlays([]);
      return;
    }
    const wrapperRect = wrapper.getBoundingClientRect();

    // Medidas das colunas (por lab)
    const colGeom = new Map<number, { left: number; width: number }>();
    for (const lab of tabelaAulasHoje.laboratorios) {
      const th = thRefs.current[lab.id];
      if (!th) continue;
      const r = th.getBoundingClientRect();
      colGeom.set(lab.id, { left: r.left - wrapperRect.left, width: r.width });
    }

    // Medidas das linhas (por horário visível)
    const rowTops: number[] = [];
    const rowBottoms: number[] = [];
    tabelaAulasHoje.horarios.forEach((h) => {
      const td = rowRefs.current[h];
      if (!td) return;
      const r = td.getBoundingClientRect();
      rowTops.push(r.top - wrapperRect.top);
      rowBottoms.push(r.bottom - wrapperRect.top);
    });
    if (!rowTops.length) {
      setEventOverlays([]);
      return;
    }

    // Função para converter minuto do dia -> Y absoluto
    const getYForMinute = (min: number): number => {
      for (let i = 0; i < tabelaAulasHoje.horarios.length; i++) {
        const h = tabelaAulasHoje.horarios[i];
        const idxFull = horarios.findIndex((x) => x === h);
        const s = toMin(h);
        const e = slotEndAt(idxFull);
        const y0 = rowTops[i];
        const y1 = rowBottoms[i];
        if (min >= s && min < e) {
          const t = (min - s) / (e - s || 1);
          return y0 + t * (y1 - y0);
        }
      }
      // Fora do range: clamp
      const hFirst = tabelaAulasHoje.horarios[0];
      const hLast =
        tabelaAulasHoje.horarios[tabelaAulasHoje.horarios.length - 1];
      const sFirst = toMin(hFirst);
      const eLast = slotEndAt(horarios.findIndex((x) => x === hLast));
      if (min < sFirst) return rowTops[0];
      if (min >= eLast) return rowBottoms[rowBottoms.length - 1];
      return rowTops[0];
    };

    const novos: Array<{
      key: string;
      left: number;
      width: number;
      top: number;
      height: number;
      nome: string;
      responsavel?: string;
      hora: string;
    }> = [];
    for (const ev of eventosDentroGrade) {
      const labId = ev.idLaboratorio;
      if (!labId) continue;
      const col = colGeom.get(labId);
      if (!col) continue;
      const dt = new Date(ev.data);
      const startMin = dt.getHours() * 60 + dt.getMinutes();
      const dur =
        typeof ev.duracao === "number" && ev.duracao > 0 ? ev.duracao : 1;
      const endMin = startMin + dur;
      const endDt = new Date(dt.getTime() + dur * 60 * 1000);
      const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));
      const hora = `${pad2(dt.getHours())}:${pad2(dt.getMinutes())} – ${pad2(
        endDt.getHours(),
      )}:${pad2(endDt.getMinutes())}`;
      const top = getYForMinute(startMin);
      const bottom = getYForMinute(endMin);
      const height = Math.max(2, bottom - top);
      // reduzir um pouco a largura para evitar overflow horizontal/scroll
      const pad = 4; // px de margem interna à esquerda e direita
      const leftAdj = col.left + pad;
      const widthAdj = Math.max(1, col.width - pad * 2);
      novos.push({
        key: `${ev.id ?? ev.nome}-${labId}-${startMin}`,
        left: leftAdj,
        width: widthAdj,
        top,
        height,
        nome: ev.nome,
        responsavel: ev.responsavel,
        hora,
      });
    }
    setEventOverlays(novos);

    const onResize = () => {
      // Recalcular ao redimensionar
      setTimeout(() => {
        // trigger by dependency changes
        setEventOverlays((prev) => [...prev]);
      }, 50);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [eventosDentroGrade, tabelaAulasHoje, horarios]);

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
    [tabelaAulasHoje.laboratorios],
  );

  // Conflitos de hoje agrupados por professor (um card por professor)
  const conflitosHojePorProfessor = useMemo(() => {
    type PorHora = { horario: string; labs: { id: number; label: string }[] };
    type PorProfessor = {
      professor: string;
      professorId?: number;
      horarios: PorHora[];
    };
    const byProfessor = new Map<string | number, PorProfessor>();
    const byKey = (profId?: number, nome?: string) =>
      profId ?? normalizeStr(nome);
    const tmpByHora = new Map<
      string,
      { profKey: string | number; data: PorHora }
    >();
    for (const a of aulasOrdenadas as Array<{
      horario: string;
      professor: string;
      professorId?: number;
      laboratorio: string;
      idLaboratorio?: number;
    }>) {
      if (!a.professor?.trim() || !a.idLaboratorio) continue;
      const profKey = byKey(a.professorId, a.professor);
      const horaKey = `${a.horario}__${profKey}`;
      const lab = { id: a.idLaboratorio, label: a.laboratorio };
      let entry = tmpByHora.get(horaKey);
      if (!entry) {
        entry = { profKey, data: { horario: a.horario, labs: [lab] } };
        tmpByHora.set(horaKey, entry);
      } else {
        if (!entry.data.labs.some((l) => l.id === lab.id))
          entry.data.labs.push(lab);
      }
    }
    // Transfere apenas horas com 2+ labs
    for (const { profKey, data } of tmpByHora.values()) {
      if (data.labs.length < 2) continue;
      let grupo = byProfessor.get(profKey);
      if (!grupo) {
        // Recupera o nome legível
        const nome =
          typeof profKey === "number"
            ? getProfessorNomeById(profKey) || ""
            : aulasOrdenadas.find((a) => normalizeStr(a.professor) === profKey)
                ?.professor || "";
        grupo = {
          professor: nome,
          professorId: typeof profKey === "number" ? profKey : undefined,
          horarios: [],
        };
        byProfessor.set(profKey, grupo);
      }
      data.labs.sort((a, b) => a.id - b.id);
      grupo.horarios.push(data);
    }
    const lista = Array.from(byProfessor.values());
    lista.forEach((g) =>
      g.horarios.sort((a, b) => a.horario.localeCompare(b.horario, "pt")),
    );
    lista.sort((a, b) =>
      a.professor.localeCompare(b.professor, "pt", { sensitivity: "base" }),
    );
    return lista;
  }, [aulasOrdenadas]);

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
      primeiraNoite &&
      (hasAfternoon || (!hasAfternoon && hasMorning))
    );
    // Separador tarde: existe tarde e existe manhã e primeiraTarde definida
    const precisaSeparadorTarde = !!(
      hasMorning &&
      hasAfternoon &&
      primeiraTarde
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
        (l) => l.id != null && !labsCarregados.has(l.id!),
      ),
    [laboratoriosUnificados, labsCarregados],
  );

  const dataHojeFormatada = useMemo(
    () =>
      new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [],
  );

  const atualizarCelula = (linha: number, coluna: number, valor: string) => {
    if (!canEditCronograma) return;
    setTabelas((prev) => {
      const copia = { ...prev };
      const tabela = copia[activeId]
        ? copia[activeId].map((l) => [...l])
        : Array.from({ length: horarios.length }, () =>
            Array(dias.length).fill(""),
          );
      tabela[linha][coluna] = valor;
      copia[activeId] = tabela;
      return copia;
    });
  };

  const salvarTabela = async () => {
    if (!canEditCronograma) {
      toast.error("Você não tem permissão para editar o cronograma.");
      return;
    }
    if (salvando) return;
    setSalvando(true);
    try {
      const orig = todosHorarios.filter((h) => h.idLaboratorio === activeId);
      const chaveMap = (dia: number, horario: string) => `${dia}-${horario}`;
      const mapaOrig = new Map<string, IHorario>(
        orig.map((h) => [chaveMap(h.diaSemana, h.horario), h]),
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
          `Professores não reconhecidos ignorados: ${desconhecidos.join(", ")}`,
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
          }),
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
          }),
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

  /* const isTabelaVazia = useMemo(() => {
    const matrizEdit = editaveis[activeId];
    if (!matrizEdit) return true;
    for (let i = 0; i < tabelaAtiva.length; i++) {
      for (let j = 0; j < tabelaAtiva[i].length; j++) {
        if (matrizEdit[i]?.[j] && tabelaAtiva[i][j].trim() !== "") return false;
      }
    }
    return true;
  }, [tabelaAtiva, editaveis, activeId]); */

  // Conflitos decorrentes das edições na tabela ativa (mostrar abaixo do cronograma)
  const conflitosEdicaoPorProfessor = useMemo(() => {
    type Item = {
      diaIdx: number;
      horario: string;
      labId: number;
      labLabel: string;
    };
    type Card = { professor: string; professorId?: number; itens: Item[] };
    const byProf = new Map<string | number, Card>();
    const addItem = (
      profKey: string | number,
      nome: string,
      profId: number | undefined,
      item: Item,
    ) => {
      let card = byProf.get(profKey);
      if (!card) {
        card = {
          professor: profId ? getProfessorNomeById(profId) || nome : nome,
          professorId: profId,
          itens: [],
        };
        byProf.set(profKey, card);
      }
      const exists = card.itens.some(
        (i) =>
          i.diaIdx === item.diaIdx &&
          i.horario === item.horario &&
          i.labId === item.labId,
      );
      if (!exists) card.itens.push(item);
    };

    const matrizEdit = editaveis[activeId];
    if (!matrizEdit) return [] as Card[];

    for (let linha = 0; linha < tabelaAtiva.length; linha++) {
      for (let coluna = 0; coluna < tabelaAtiva[linha].length; coluna++) {
        if (!matrizEdit[linha]?.[coluna]) continue;
        const nome = tabelaAtiva[linha][coluna].trim();
        if (!nome) continue;
        const profId = nomeParaProfessorId(nome);
        const profKey: string | number = profId ?? normalizeStr(nome);
        const diaIdx = coluna; // 0..5 corresponde a dias[]
        const diaSemana = colunaParaDiaSemana(coluna);
        const horario = horarios[linha];

        // Backend
        for (const h of todosHorarios) {
          if (!h.idLaboratorio || h.idLaboratorio === activeId) continue;
          if (h.diaSemana !== diaSemana || h.horario !== horario) continue;
          const matchId = profId && h.idProfessor && h.idProfessor === profId;
          const matchNome =
            !profId && normalizeStr(h.professor?.nome) === normalizeStr(nome);
          if (matchId || matchNome) {
            const labLabel =
              getLaboratorioNomeById(h.idLaboratorio) ||
              (h.laboratorio?.nome
                ? `${h.laboratorio.nome}${
                    h.laboratorio.numero ? ` - ${h.laboratorio.numero}` : ""
                  }`
                : `Lab ${h.idLaboratorio}`);
            addItem(profKey, nome, profId, {
              diaIdx,
              horario,
              labId: h.idLaboratorio,
              labLabel,
            });
          }
        }

        // Edições locais em outros labs
        for (const labIdStr of Object.keys(tabelas)) {
          const labId = Number(labIdStr);
          if (!labId || labId === activeId) continue;
          const mat = tabelas[labId];
          const editMat = editaveis[labId];
          if (!mat || !editMat) continue;
          if (!editMat[linha]?.[coluna]) continue; // slot não existe
          const cell = mat[linha]?.[coluna] || "";
          if (normalizeStr(cell) === normalizeStr(nome)) {
            const labLabel = getLaboratorioNomeById(labId) || `Lab ${labId}`;
            addItem(profKey, nome, profId, {
              diaIdx,
              horario,
              labId,
              labLabel,
            });
          }
        }
      }
    }

    const cards = Array.from(byProf.values());
    cards.forEach((c) =>
      c.itens.sort(
        (a, b) =>
          a.diaIdx - b.diaIdx || a.horario.localeCompare(b.horario, "pt"),
      ),
    );
    cards.sort((a, b) =>
      a.professor.localeCompare(b.professor, "pt", { sensitivity: "base" }),
    );
    return cards;
  }, [tabelaAtiva, editaveis, activeId, todosHorarios, tabelas, professores]);

  // Inicializa tabela vazia se seleciona laboratório ainda não carregado
  useEffect(() => {
    if (activeId && !tabelas[activeId]) {
      setTabelas((prev) => ({
        ...prev,
        [activeId]: Array.from({ length: horarios.length }, () =>
          Array(dias.length).fill(""),
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
      <div className="aulas-hoje-section w-full flex flex-col">
        <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
          Aulas de Hoje
        </p>
        <div className="flex-1 rounded-[10px] border-2 border-dashed border-theme-blue/40 p-4 text-sm leading-relaxed mb-6 bg-gradient-to-br from-theme-blue/5 via-theme-blue/0 to-theme-blue/5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="text-theme-blue font-medium capitalize">
              {dataHojeFormatada}
            </span>
            <span className="contador-aulas text-[0.65rem] px-2 py-1 rounded-full bg-theme-blue text-theme-white font-semibold tracking-wide">
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
              <p className="text-[0.7rem] max-w-[240px] font-normal leading-snug">
                Adicione professores às aulas ou cadastre novas para
                visualizá-las aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="relative" ref={overlayWrapperRef}>
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
                          ref={(el) => {
                            thRefs.current[labObj.id] = el;
                          }}
                          className={`bg-theme-blue text-theme-white font-semibold ${
                            compactMode
                              ? "px-2 py-2 text-[0.6rem]"
                              : "px-3 py-2"
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
                                colSpan={
                                  1 + tabelaAulasHoje.laboratorios.length
                                }
                                className="bg-gradient-to-r from-transparent via-amber-300/40 to-transparent h-[6px] p-0"
                                title="Intervalo"
                              />
                            </tr>
                          )}
                          {isNightSeparator && (
                            <tr key={hora + "_sep"}>
                              <td
                                colSpan={
                                  1 + tabelaAulasHoje.laboratorios.length
                                }
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
                              ref={(el) => {
                                rowRefs.current[hora] = el;
                              }}
                              className="sticky left-0 z-10 bg-theme-blue/90 text-theme-white font-semibold px-3 border border-theme-blue/20 whitespace-nowrap"
                            >
                              <div className="h-14 flex items-center">
                                {hora}
                              </div>
                            </td>
                            {tabelaAulasHoje.laboratorios.map((labObj) => {
                              const chave = `${hora}__${labObj.id}`;
                              const professor = tabelaAulasHoje.mapa[chave];
                              return (
                                <td
                                  key={labObj.id + "_" + hora}
                                  className={`${
                                    compactMode ? "px-1" : "px-2"
                                  } ${
                                    compactMode
                                      ? "min-w-[90px]"
                                      : "min-w-[140px]"
                                  } border border-theme-blue/15 align-top`}
                                >
                                  <div className="relative h-14">
                                    {professor ? (
                                      <div className="absolute inset-0 flex items-center justify-start pr-1">
                                        <span
                                          className="font-bold text-theme-blue truncate"
                                          title={professor}
                                        >
                                          {professor}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-theme-blue/30 select-none">
                                        —
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
                {/* Overlay de eventos flutuando acima das células */}
                <div className="pointer-events-none absolute inset-0 z-30">
                  {eventOverlays.map((o) => {
                    const small = o.height < 22; // mostra somente título
                    const medium = !small && o.height < 36; // mostra título + horário
                    const padClass = small
                      ? "px-1.5 py-0.5 gap-0.5"
                      : medium
                        ? "px-2 py-0.5 gap-0.5"
                        : "px-2.5 py-1 gap-1";
                    return (
                      <div
                        key={o.key}
                        className="absolute rounded-md border border-red-800 bg-red-700/95 text-white shadow-md overflow-hidden pointer-events-auto"
                        style={{
                          left: o.left,
                          width: o.width,
                          top: o.top,
                          height: o.height,
                        }}
                        title={
                          o.responsavel
                            ? `${o.nome} — ${o.responsavel} (${o.hora})`
                            : `${o.nome} (${o.hora})`
                        }
                        aria-label={
                          o.responsavel
                            ? `${o.nome}, ${o.hora}, responsável ${o.responsavel}`
                            : `${o.nome}, ${o.hora}`
                        }
                      >
                        <div
                          className={`h-full flex flex-col items-center justify-center text-center ${padClass}`}
                        >
                          <div
                            className={
                              small
                                ? "text-[0.75rem] font-semibold leading-tight truncate w-full"
                                : "text-[0.9rem] font-bold leading-snug truncate w-full"
                            }
                            title={o.nome}
                          >
                            {o.nome}

                          </div>
                          {!small && (
                            <div
                              className={
                                medium
                                  ? "text-[0.7rem] font-semibold leading-tight truncate w-full"
                                  : "text-[0.8rem] font-semibold leading-snug truncate w-full"
                              }
                              title={o.hora}
                            >
                              {o.hora}
                            </div>
                          )}
                          {!small && !medium && o.responsavel ? (
                            <div className="text-[0.75rem] font-medium leading-snug truncate w-full opacity-95" title={o.responsavel}>
                              {o.responsavel}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {eventosForaGrade.length > 0 && (
            <div className="mt-4 rounded-[10px] border border-red-200 bg-red-50/70 p-3">
              <p className="text-[0.78rem] font-semibold text-red-800 uppercase tracking-wide mb-2">
                Eventos fora do expediente (após 21:30 ou antes de 08:15)
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {eventosForaGrade.map((ev) => {
                  const dt = new Date(ev.data);
                  const dur =
                    typeof ev.duracao === "number" && ev.duracao > 0
                      ? ev.duracao
                      : 1;
                  const endDt = new Date(dt.getTime() + dur * 60 * 1000);
                  const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));
                  const hora = `${pad2(dt.getHours())}:${pad2(dt.getMinutes())} – ${pad2(
                    endDt.getHours(),
                  )}:${pad2(endDt.getMinutes())}`;
                  return (
                    <div
                      key={`fora_${ev.id ?? ev.nome}_${ev.data}`}
                      className="rounded-[8px] border border-red-300 bg-white px-3 py-2 text-[0.75rem] text-red-900"
                    >
                      <p className="font-bold leading-tight">{ev.nome}</p>
                      <p className="font-semibold opacity-90">{hora}</p>
                      <p className="opacity-90">{getEventoLabLabel(ev)}</p>
                      {ev.responsavel ? (
                        <p className="opacity-80">Responsável: {ev.responsavel}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conflitos do dia (um card por professor) */}
      {conflitosHojePorProfessor.length > 0 && (
        <div className="w-full grid gap-3 md:grid-cols-2 -mt-4 mb-8">
          {conflitosHojePorProfessor.map((prof) => {
            // Unifica todos os labs envolvidos (sem detalhar horários)
            const labsMap = new Map<number, string>();
            prof.horarios.forEach((h) =>
              h.labs.forEach((l) => labsMap.set(l.id, l.label)),
            );
            return (
              <div
                key={prof.professor + (prof.professorId ?? "")}
                className="rounded-[12px] border border-yellow-500 bg-yellow-50 text-yellow-900 p-3 shadow-sm"
              >
                <div className="mb-1 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-yellow-950">
                  <span className="text-[0.9rem]">⚠️</span>
                  <span className="uppercase tracking-wide">
                    Conflito de horário
                  </span>
                </div>
                <div className="font-semibold text-[1rem] leading-snug">
                  {prof.professor}
                </div>
                <div className="mb-2">
                  <span className="inline-flex items-center rounded-full bg-yellow-200 text-yellow-950 px-2 py-0.5 text-[0.8rem] font-semibold tracking-wide">
                    Hoje
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(labsMap.entries()).map(([id, label]) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-300 px-2 py-0.5 text-[0.75rem] font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cronograma editável */}
      <div className="w-full flex flex-col">
        <div className="w-full h-9/10 flex flex-col mb-4 gap-3">
          <p className="font-semibold text-[1.2rem] text-theme-blue">
            Cronograma de aulas
          </p>
          <div className="lab-select w-full max-w-xs">
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
                  {(lab.numero || "").trim()} - {(lab.nome || "").trim()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table id="tabela-cronograma" className="w-full border-collapse">
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
                            {canEditCronograma ? (
                              <ProfessorAutocomplete
                                value={tabelaAtiva[linha][coluna]}
                                onChange={(val) =>
                                  atualizarCelula(linha, coluna, val)
                                }
                                professores={professores}
                                disabled={loadingTabela}
                              />
                            ) : (
                              <div className="flex min-h-[50px] items-center justify-center px-2 py-3 text-center text-sm font-semibold text-theme-blue">
                                {tabelaAtiva[linha][coluna] || ""}
                              </div>
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
        {/* Conflitos atuais do cronograma (sem inline nas células) */}
        {canEditCronograma &&
          (() => {
            const cards = conflitosEdicaoPorProfessor;
            if (!cards.length) return null;
            return (
              <div className="w-full grid gap-3 md:grid-cols-2 mt-3">
                {cards.map((prof) => {
                  // Unifica por (dia, lab) ignorando horário
                  const pares = new Map<
                    string,
                    { diaIdx: number; labLabel: string }
                  >();
                  prof.itens.forEach((it) => {
                    const key = `${it.diaIdx}__${it.labLabel}`;
                    if (!pares.has(key))
                      pares.set(key, {
                        diaIdx: it.diaIdx,
                        labLabel: it.labLabel,
                      });
                  });
                  return (
                    <div
                      key={prof.professor + (prof.professorId ?? "")}
                      className="rounded-[12px] border border-yellow-500 bg-yellow-50 text-yellow-900 p-3 shadow-sm"
                    >
                      <div className="mb-1 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-yellow-950">
                        <span className="text-[0.9rem]">⚠️</span>
                        <span className="uppercase tracking-wide">
                          Conflito de horário
                        </span>
                      </div>
                      <div className="font-semibold text-[1rem] leading-snug mb-1">
                        {prof.professor}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(pares.values()).map((p) => (
                          <span
                            key={`${p.diaIdx}__${p.labLabel}`}
                            className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-300 px-2 py-0.5 text-[0.75rem] font-medium"
                          >
                            <strong>{dias[p.diaIdx]}</strong> — {p.labLabel}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        <div
          className={`w-full flex items-center ${
            canEditCronograma && cookies.usuario?.permissao?.geral
              ? "justify-between"
              : "justify-end"
          } mt-4`}
        >
          {canEditCronograma && cookies.usuario?.permissao?.geral ? (
            <button
              type="button"
              className="bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px]"
              onClick={() => setModalOpen(true)}
            >
              Limpar Horários
            </button>
          ) : null}

          {canEditCronograma ? (
            <button
              type="button"
              onClick={salvarTabela}
              disabled={salvando}
              className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] ${
                salvando ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          ) : null}
        </div>
      </div>
      <CustomModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Limpar Horários"
        message="Tem certeza que deseja limpar todos os horários? Esta ação não pode ser desfeita."
        confirmText="Sim, limpar"
        cancelText="Cancelar"
        onConfirm={async () => {
          try {
            apiOnline.post("/reseter/reset");
            toast.success("Horários limpos com sucesso.");
            // Força recarregar dados
            setTabelas({});
            setLabsCarregados(new Set());
            setTodosHorarios([]);
          } catch (e) {
            console.error("Erro ao limpar horários", e);
            toast.error("Erro ao limpar horários.");
          }

          setModalOpen(false);
        }}
        onCancel={async () => {
          setModalOpen(false);
        }}
      />
    </div>
  );
}
