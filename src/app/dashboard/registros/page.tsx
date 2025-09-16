"use client";

import Loading from "@/app/loading";
import { IRegistro, IUsuario } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import ListaRegistros from "@/components/Registros";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface FiltroDatas {
  inicio: dayjs.Dayjs | null;
  fim: dayjs.Dayjs | null;
}

export default function RegistrosPage() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [registros, setRegistros] = useState<IRegistro[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number>(0);
  const [datas, setDatas] = useState<FiltroDatas>({ inicio: null, fim: null });
  const [buscaRegistros, setBuscaRegistros] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  // Removido totalRegistros não utilizado para atender lint
  const [, setTotalRegistros] = useState<number>(0);
  const itensPorPagina = 10;

  useEffect(() => {
    setLoading(true);
    const buscaUsuarios = async () => {
      try {
        const response = await apiOnline.get<{ data: IUsuario[] }>("/usuario");
        setUsuarios(response.data);
      } catch (error: unknown) {
        const errObj = error as { response?: { data?: { erros?: string[] } } };
        if (errObj?.response?.data?.erros) {
          errObj.response.data.erros.map((err: string) => toast.error(err));
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
      const dataFim = new Date(datas.fim as unknown as string);
      dataFim.setHours(23, 59, 59, 999);
      query += `&dataInicio=${datas.inicio.toISOString()}&dataFim=${dataFim.toISOString()}`;
    }
    const buscaRegistros = async () => {
      setLoading(true);
      try {
        const repCount = await apiOnline.get<{ total: number }>(
          "/registro/count"
        );
        const total = (repCount as { count?: number }).count ?? 0;
        setTotalRegistros(total);
        setTotalPaginas(Math.ceil(total / itensPorPagina));
        const response = await apiOnline.get<{ data: IRegistro[] }>(
          `/registro${query}`
        );
        if ((response.data as unknown as { total?: number })?.total !== total) {
          setTotalRegistros(
            (response.data as unknown as { total?: number })?.total || total
          );
        }
        setRegistros(
          (response.data as unknown as { registros: IRegistro[] }).registros
        );
        setTotalPaginas(
          Math.ceil(
            ((response.data as unknown as { total?: number })?.total || total) /
              itensPorPagina
          )
        );
      } catch (error: unknown) {
        const errObj = error as { response?: { data?: { erros?: string[] } } };
        if (errObj?.response?.data?.erros) {
          errObj.response.data.erros.map((err: string) => toast.error(err));
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
        <div className="flex min-w-[220px] items-center align-middle">
          <FormControl
            className="w-full font-normal p-3 text-[0.9rem] rounded-md"
            variant="filled"
          >
            <InputLabel id="demo-simple-select-filled-label">
              Usuário
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              value={usuarioSelecionado ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setUsuarioSelecionado(val ? Number(val) : 0);
              }}
            >
              <MenuItem value="">-- Selecione --</MenuItem>
              {usuarios.map((u) => (
                <MenuItem key={u.id} value={u.id || ""}>
                  {u.login} - {u.nome}
                  {u.ativo === false ? " (desativado)" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex gap-4 flex-wrap">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <span>
              <DatePicker
                label="Data de início"
                format="DD/MM/YYYY"
                value={datas.inicio ? dayjs(datas.inicio) : null}
                onChange={(newValue) =>
                  setDatas((d) => ({
                    ...d,
                    inicio: newValue,
                    fim:
                      d.fim && newValue && newValue.isAfter(d.fim)
                        ? newValue.add(1, "day")
                        : d.fim,
                  }))
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    className: "p-3 rounded-md",
                  },
                }}
              />
            </span>
            <span>
              <DatePicker
                label="Data final"
                format="DD/MM/YYYY"
                value={datas.fim ? dayjs(datas.fim) : null}
                minDate={
                  datas.inicio
                    ? dayjs(datas.inicio).add(1, "day")
                    : dayjs().add(1, "day")
                }
                onChange={(newValue) => {
                  if (
                    newValue &&
                    datas.inicio &&
                    newValue.isBefore(datas.inicio)
                  ) {
                    toast.error("Data fim não pode ser menor que data início");
                    return;
                  }
                  setDatas((d) => ({
                    ...d,
                    fim: newValue,
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    className: "p-3 rounded-md",
                  },
                }}
              />
            </span>
          </LocalizationProvider>
        </div>

        <span className="flex gap-2 mr-auto">
          <button
            type="button"
            className="bg-theme-blue h-10 px-4 rounded-[10px] text-theme-white font-semibold"
            onClick={() => {
              setBuscaRegistros(!buscaRegistros);
            }}
          >
            Buscar
          </button>
          <button
            type="button"
            className="bg-theme-blue h-10 px-4 rounded-[10px] text-theme-white font-semibold"
            onClick={() => {
              setUsuarioSelecionado(0);
              setDatas({ inicio: null, fim: null });
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
