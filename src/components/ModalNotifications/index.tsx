import { useState } from "react";
import {
  CircularProgress,
  Modal,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { apiOnline } from "@/services/services";
import { IEvento, IRecado } from "../Lists/types";
import style from "./ModalNotification.module.scss";
import { maskDate } from "@/utils/maskDate";
import { useNotificationStore } from "@/store";
import { fetchAndCountNotifications } from "@/utils/fetchNotifications";

interface ModalNotificationProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function ModalNotification({
  open,
  setOpen,
}: ModalNotificationProps) {
const eventos = useNotificationStore(s => s.eventos);
const recados = useNotificationStore(s => s.recados);
const setEventos = useNotificationStore(s => s.setEventos);
const setRecados = useNotificationStore(s => s.setRecados);
const loading = useNotificationStore(s => s.loading);

  const [openEditEvento, setOpenEditEvento] = useState(false);
  const [openEditRecado, setOpenEditRecado] = useState(false);
  const [openDelete, setOpenDelete] = useState<null | {
    type: "evento" | "recado";
    id: number;
  }>(null);
  const [draftEvento, setDraftEvento] = useState<Partial<IEvento>>({});
  const [draftRecado, setDraftRecado] = useState<Partial<IRecado>>({});

  const colors = [
    "divider-green",
    "divider-orange",
    "divider-yellow",
    "divider-purple",
  ];

  function parseDuracao(duracao: number): string {
    if (duracao > 60) {
      const horas = Math.floor(duracao / 60);
      const minutos = duracao % 60;
      return `${horas} hora(s) e ${minutos} minuto(s)`;
    } else {
      return `${duracao} minuto(s)`;
    }
  }

  function openEventoForEdit(e: IEvento) {
    const data = new Date(e.data);
    setDraftEvento({
      ...e,
      // separar data e hora para inputs
      data: data,
      nome: e.nome,
      responsavel: e.responsavel,
      duracao: e.duracao,
      idLaboratorio: e.idLaboratorio,
    });
    setOpenEditEvento(true);
  }

  function openRecadoForEdit(r: IRecado) {
    setDraftRecado({ ...r });
    setOpenEditRecado(true);
  }

  async function handleSaveEvento(e: React.FormEvent) {
    e.preventDefault();
    if (!draftEvento?.id) return;
    try {
      const dateObj =
        draftEvento.data instanceof Date
          ? draftEvento.data
          : new Date(draftEvento.data!);
      await apiOnline.put(`/evento/${draftEvento.id}`, {
        nome: draftEvento.nome,
        dataEvento: dateObj,
        duracao: draftEvento.duracao,
        responsavel: draftEvento.responsavel,
        idLaboratorio: draftEvento.idLaboratorio,
      });
      setEventos((prev) => {
        const updated = prev.map((ev) =>
          ev.id === draftEvento.id
            ? ({ ...(ev as IEvento), ...draftEvento, data: dateObj } as IEvento)
            : ev
        );
        return updated.sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
        );
      });
      toast.success("Evento atualizado com sucesso!");
      setOpenEditEvento(false);
    } catch {
      toast.error("Erro ao atualizar evento.");
    }
  }

  async function handleSaveRecado(e: React.FormEvent) {
    e.preventDefault();
    if (!draftRecado?.id) return;
    try {
      await apiOnline.put(`/recado/${draftRecado.id}`, {
        texto: draftRecado.texto,
      });
      setRecados((prev) => {
        const updated = prev.map((r) =>
          r.id === draftRecado.id
            ? ({ ...(r as IRecado), ...draftRecado } as IRecado)
            : r
        );
        return updated.sort((a, b) => a.id - b.id);
      });
      toast.success("Recado atualizado com sucesso!");
      setOpenEditRecado(false);
    } catch {
      toast.error("Erro ao atualizar recado.");
    }
  }

  async function handleDelete() {
    if (!openDelete) return;
    try {
      if (openDelete.type === "evento") {
        await apiOnline.delete(`/evento/${openDelete.id}`);
        setEventos((prev) =>
          prev
            .filter((e) => e.id !== openDelete.id)
            .sort(
              (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
            )
        );
      } else {
        await apiOnline.delete(`/recado/${openDelete.id}`);
        setRecados((prev) =>
          prev.filter((r) => r.id !== openDelete.id).sort((a, b) => a.id - b.id)
        );
      }

      await fetchAndCountNotifications();
      toast.success("Excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir.");
    } finally {
      setOpenDelete(null);
    }
  }

  if (loading) {
    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-full h-full flex justify-center items-center">
          <CircularProgress />
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={`${style.container} flex lmd:flex-row flex-col bg-theme-white w-[90%] overflow-y-auto max-w-[1300px] h-[90vh] max-h-[600px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-5`}>
          <CloseIcon onClick={() => setOpen(false)} className="cursor-pointer absolute top-3 right-3"/>

          <div className="lmd:w-1/2 w-full flex flex-col">
            <p className="text-theme-blue font-semibold text-[1.4rem] pl-4">Avisos</p>
            <div
              className={`${style.scrollbarContainer} flex flex-col gap-2 overflow-y-auto p-4`}
            >
              {recados.length > 0 ? (
                recados.map((recado, index) => {
                  const colorClass = colors[index % colors.length];
                  return (
                    <div
                      key={recado.id}
                      className={`${style.card} w-full group relative flex items-center gap-2 rounded-[15px] cursor-pointer`}
                      onClick={() => openRecadoForEdit(recado)}
                    >
                      <div
                        className={`${style.divider2} ${style[colorClass]}`}
                      ></div>
                      <div className="w-full">
                        <p className="font-normal text-[0.9rem] text-theme-text w-[calc(100%-50px)]">
                          {recado.texto}
                        </p>
                      </div>
                      <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                        <Tooltip title="Editar" placement="top">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRecadoForEdit(recado);
                            }}
                          >
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir" placement="top">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDelete({ type: "recado", id: recado.id });
                            }}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-theme-text font-normal">
                  Nenhum aviso disponível.
                </p>
              )}
            </div>
          </div>

          <div className={`lmd:w-1/2 w-full flex flex-col`}>
            <p className="text-theme-blue font-semibold text-[1.4rem] pl-4">Eventos</p>
            <div
              className={`${style.scrollbarContainer} flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-1`}
            >
              {eventos.length > 0 ? (
                eventos.map((evento, index) => {
                  const colorClass = colors[index % colors.length];

                  return (
                    <div
                      key={evento.id}
                      className={`${style.card} group relative flex items-center gap-2 rounded-[15px] cursor-pointer`}
                      onClick={() => openEventoForEdit(evento)}
                    >
                      <div
                        className={`${style.divider} ${style[colorClass]}`}
                      ></div>
                      <div className="w-full">
                        <p className="font-medium text-[0.9rem] leading-4 mb-1 w-[calc(100%-50px)]">
                          {evento.nome}
                        </p>
                        <p className="font-normal text-[0.8rem] text-theme-text flex items-center gap-1">
                          <span>
                            {maskDate(
                              new Date(evento.data)
                                .toISOString()
                                .split("T")[0]
                                .replace(/-/g, "/")
                            )}
                          </span>
                          <span>às</span>
                          <span>
                            {new Date(evento.data).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </p>
                        <p className="font-normal text-[0.8rem] text-theme-text">
                          <span>Duração: {parseDuracao(evento.duracao)}</span>
                        </p>
                        <p className="font-normal text-[0.8rem] text-theme-text">
                          <span>Responsável: {evento.responsavel}</span>
                        </p>
                        <p className="font-normal text-[0.9rem] text-theme-text mt-1">
                          <span>
                            Local: {evento.laboratorio?.numero} -{" "}
                            {evento.laboratorio?.nome}
                          </span>
                        </p>
                      </div>
                      <div className="absolute top-1 right-1 hidden group-hover:flex">
                        <Tooltip title="Editar" placement="top">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEventoForEdit(evento);
                            }}
                          >
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir" placement="top">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDelete({ type: "evento", id: evento.id });
                            }}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-theme-text font-normal">
                  Nenhum evento disponível.
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal editar evento */}
      <Modal open={openEditEvento} onClose={() => setOpenEditEvento(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className="bg-white rounded-[12px] p-8 w-[80%] max-w-[700px] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[1.1rem] text-theme-blue font-semibold m-0">
              Editar evento
            </h2>
            <IconButton onClick={() => setOpenEditEvento(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <form onSubmit={handleSaveEvento} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 font-normal">
              <TextField
                size="small"
                label="Nome"
                value={draftEvento.nome || ""}
                onChange={(e) =>
                  setDraftEvento((d) => ({ ...d, nome: e.target.value }))
                }
                fullWidth
              />
              <TextField
                size="small"
                type="number"
                label="Duração (min)"
                value={draftEvento.duracao ?? 0}
                onChange={(e) =>
                  setDraftEvento((d) => ({
                    ...d,
                    duracao: Number(e.target.value),
                  }))
                }
                fullWidth
              />
              <TextField
                size="small"
                label="Responsável"
                value={draftEvento.responsavel || ""}
                onChange={(e) =>
                  setDraftEvento((d) => ({
                    ...d,
                    responsavel: e.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                size="small"
                type="date"
                label="Data"
                InputLabelProps={{ shrink: true }}
                value={
                  draftEvento.data
                    ? new Date(draftEvento.data).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setDraftEvento((d) => ({
                    ...d,
                    data: new Date(
                      `${e.target.value}T${new Date(d!.data || new Date())
                        .toISOString()
                        .split("T")[1]
                      }`
                    ),
                  }))
                }
                fullWidth
              />
              <TextField
                size="small"
                type="time"
                label="Hora"
                InputLabelProps={{ shrink: true }}
                value={
                  draftEvento.data
                    ? new Date(draftEvento.data).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : ""
                }
                onChange={(e) => {
                  const datePart = draftEvento.data
                    ? new Date(draftEvento.data).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0];
                  setDraftEvento((d) => ({
                    ...d,
                    data: new Date(`${datePart}T${e.target.value}:00`),
                  }));
                }}
                fullWidth
              />
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setOpenEditEvento(false)}
                className="bg-theme-blue text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-theme-green text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal editar recado */}
      < Modal open={openEditRecado} onClose={() => setOpenEditRecado(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className="bg-white rounded-[12px] p-8 w-[80%] max-w-[700px] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[1.1rem] text-theme-blue font-semibold m-0">
              Editar recado
            </h2>
            <IconButton onClick={() => setOpenEditRecado(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <form onSubmit={handleSaveRecado} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 font-normal">
              <TextField
                size="small"
                label="Recado"
                multiline
                minRows={4}
                value={draftRecado.texto || ""}
                onChange={(e) =>
                  setDraftRecado((r) => ({ ...r, texto: e.target.value }))
                }
                className="col-span-2"
                fullWidth
              />
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setOpenEditRecado(false)}
                className="bg-theme-blue text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-theme-green text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </ Modal>

      {/* Modal excluir */}
      < Modal open={!!openDelete} onClose={() => setOpenDelete(null)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className="bg-white rounded-[12px] p-8 w-[80%] max-w-[520px] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        >
          <h2 className="text-[1.1rem] mb-4 text-theme-blue font-semibold">
            Confirmar exclusão
          </h2>
          <p className="text-theme-text text-sm mb-6 font-normal leading-5">
            Tem certeza que deseja excluir este{" "}
            {openDelete?.type === "evento" ? "evento" : "recado"}? Esta ação não
            poderá ser desfeita.
          </p>
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => setOpenDelete(null)}
              className="bg-theme-blue text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="bg-theme-red text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
            >
              Excluir
            </button>
          </div>
        </div>
      </ Modal>
    </>
  )
}