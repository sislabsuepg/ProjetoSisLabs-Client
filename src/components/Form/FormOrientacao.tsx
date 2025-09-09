"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { cadastro_orientacao } from "@/schemas";
import { ILaboratorio, IProfessor, IAcademico } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { AxiosError } from "axios";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

export default function FormOrientacao() {
  const [form, setForm] = useState<{
    dataInicio: Dayjs | null;
    dataFim: Dayjs | null;
    idAluno: number;
    idProfessor: number;
    idLaboratorio: number;
  }>({
    dataInicio: null,
    dataFim: null,
    idAluno: 0,
    idProfessor: 0,
    idLaboratorio: 0,
  });

  const [ra, setRa] = useState("");
  const [professores, setProfessores] = useState<IProfessor[]>([]);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const alunos = await apiOnline.get<IAcademico[]>(`/aluno?ra=${ra}`);
      if (!alunos?.[0]?.id) {
        toast.error("RA não encontrado.");
        return;
      }

      const formComAluno = {
        ...form,
        idAluno: alunos[0].id,
        dataInicio: form.dataInicio?.toISOString(),
        dataFim: form.dataFim?.toISOString(),
      };

      await cadastro_orientacao.validate(formComAluno);
      await apiOnline.post("/orientacao", formComAluno);
      toast.success("Cadastro da orientação realizado com sucesso!");
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.message);
      } else if (err instanceof AxiosError) {
        const data = err.response?.data as { erros?: string[] } | undefined;
        if (data?.erros) data.erros.forEach((e) => toast.error(e));
        else toast.error("Erro inesperado. Tente novamente.");
      } else {
        toast.error("Erro inesperado. Tente novamente.");
      }
    }
  };

  const isFormValid =
    !!form.dataInicio &&
    !!form.dataFim &&
    form.idProfessor !== 0 &&
    form.idLaboratorio !== 0 &&
    ra.trim() !== "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professoresResponse, laboratoriosResponse] = await Promise.all([
          apiOnline.get<IProfessor[]>("/professor"),
          apiOnline.get<ILaboratorio[]>("/laboratorio?restrito=true"),
        ]);
        setProfessores(professoresResponse ?? []);
        setLaboratorios(laboratoriosResponse ?? []);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          const data = err.response?.data as { erros?: string[] } | undefined;
          if (data?.erros && data.erros.length > 0) {
            data.erros.forEach((e) => toast.error(e));
          } else {
            toast.error("Erro ao buscar dados. Tente novamente.");
          }
        } else {
          toast.error("Erro ao buscar dados. Tente novamente.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        📝 Cadastro da orientação
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col w-full justify-between h-full"
      >
        <div className="space-y-4">
          <div className="w-full flex items-center gap-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data de início"
                format="DD/MM/YYYY"
                value={form.dataInicio}
                minDate={dayjs()}
                onChange={(newValue) =>
                  setForm((f) => ({
                    ...f,
                    dataInicio: newValue,
                    dataFim:
                      f.dataFim && newValue && newValue.isAfter(f.dataFim)
                        ? newValue.add(1, "day")
                        : f.dataFim,
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

              <DatePicker
                label="Data final"
                format="DD/MM/YYYY"
                value={form.dataFim}
                minDate={
                  form.dataInicio
                    ? form.dataInicio.add(1, "day")
                    : dayjs().add(1, "day")
                }
                onChange={(newValue) =>
                  setForm((f) => ({ ...f, dataFim: newValue }))
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    className: "p-3 rounded-md",
                  },
                }}
              />
            </LocalizationProvider>
          </div>

          <div className="w-full flex items-center gap-4">
            <TextField
              label="RA do aluno"
              variant="filled"
              name="ra"
              value={ra}
              onChange={(e) => setRa(e.target.value)}
              inputProps={{ maxLength: 13 }}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
            />

            <FormControl className="w-full" variant="filled">
              <InputLabel>Professor</InputLabel>
              <Select
                name="idProfessor"
                value={form.idProfessor}
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>-- Selecione uma opção --</MenuItem>
                {professores.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="w-full flex items-center gap-4">
            <FormControl className="w-full" variant="filled">
              <InputLabel>Laboratório</InputLabel>
              <Select
                name="idLaboratorio"
                value={form.idLaboratorio}
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>-- Selecione uma opção --</MenuItem>
                {laboratorios.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="w-full flex items-center justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] ${
              !isFormValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
