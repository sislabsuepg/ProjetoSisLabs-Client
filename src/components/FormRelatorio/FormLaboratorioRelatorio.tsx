"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { apiOnline } from "@/services/services";
import { Laboratorio } from "@/utils/tipos";

const initialState = {
  laboratorioId: "",
  tipoEntrada: "",
  periodo: { de: null as Dayjs | null, ate: null as Dayjs | null },
};

export default function FormLaboratorioRelatorio() {
  const [form, setForm] = useState(initialState);
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLabs, setIsFetchingLabs] = useState(true);

  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        setIsFetchingLabs(true);
        const response = await apiOnline.get<{ data: Laboratorio[] }>(
          "/laboratorio"
        );
        setLaboratorios(response.data || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Falha ao carregar a lista de laboratórios.");
      } finally {
        setIsFetchingLabs(false);
      }
    };
    fetchLaboratorios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }

    setIsLoading(true);
    try {
      //Formatação das datas
      const dataInicio = form.periodo.de?.format("YYYY-MM-DD");
      const dataFim = form.periodo.ate?.format("YYYY-MM-DD");

      const endpoint = `/relatorio/emprestimo?laboratorioId=${form.laboratorioId}&tipoEntrada=${form.tipoEntrada}&dataInicio=${dataInicio}&dataFim=${dataFim}`;

      const response = await apiOnline.get<Blob>(endpoint, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `relatorio_laboratorio_${form.laboratorioId}_${dataInicio}_a_${dataFim}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download do relatório iniciado!");
      setForm(initialState);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Erro ao gerar o relatório.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    form.tipoEntrada !== "" &&
    form.laboratorioId !== "" &&
    form.periodo.de !== null &&
    form.periodo.ate !== null &&
    form.periodo.de.isValid() &&
    form.periodo.ate.isValid() &&
    form.periodo.ate.isAfter(form.periodo.de);

  return (
    <div className="w-full flex flex-col h-full">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        📊 Gerar relatório - Laboratório
      </p>

      <form
        onSubmit={handleSubmit}
        className="h-full space-y-6 w-full flex flex-col justify-between"
      >
        <div className="w-full flex flex-col gap-4">
          <div className="w-full bg-theme-container py-3 px-5 rounded-[10px] relative">
            <p className="font-semibold text-theme-blue mb-2">
              Tipo de entrada
            </p>
            <FormControl className="w-full">
              <RadioGroup
                value={form.tipoEntrada}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tipoEntrada: e.target.value }))
                }
              >
                <FormControlLabel
                  value="emprestimo"
                  control={<Radio />}
                  label="Empréstimo de chave"
                />
                <FormControlLabel
                  value="pesquisa"
                  control={<Radio />}
                  label="Orientação/Pesquisa"
                />
                <FormControlLabel
                  value="ambos"
                  control={<Radio />}
                  label="Ambos"
                />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="w-full flex flex-col gap-4">
            <FormControl
              className="w-full"
              variant="filled"
              disabled={isFetchingLabs || isLoading}
            >
              <InputLabel>Laboratório</InputLabel>
              <Select
                value={form.laboratorioId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, laboratorioId: e.target.value }))
                }
              >
                <MenuItem value="">
                  <em>-- Selecione uma opção --</em>
                </MenuItem>
                {laboratorios.map((lab) => (
                  <MenuItem key={lab.id} value={lab.id}>
                    {lab.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="w-full flex gap-4 flex-col md:flex-row">
                <DatePicker
                  label="Data inicial"
                  format="DD/MM/YYYY"
                  value={form.periodo.de}
                  onChange={(newValue) => {
                    if (
                      newValue &&
                      form.periodo.ate &&
                      newValue.isAfter(form.periodo.ate)
                    ) {
                      setForm((f) => ({
                        ...f,
                        periodo: {
                          de: newValue,
                          ate: newValue
                            .add(1, "day")
                            .add(23, "hour")
                            .add(59, "minute")
                            .add(59, "second"),
                        },
                      }));
                    }
                    setForm((f) => ({
                      ...f,
                      periodo: { ...f.periodo, de: newValue },
                    }));
                  }}
                  slotProps={{
                    textField: { variant: "filled", className: "w-full" },
                  }}
                />

                <DatePicker
                  label="Data final"
                  value={form.periodo.ate}
                  minDate={form.periodo.de?.add(1, "day") || undefined}
                  onChange={(newValue) =>
                    setForm((f) => ({
                      ...f,
                      periodo: {
                        ...f.periodo,
                        ate:
                          newValue
                            ?.add(23, "hour")
                            .add(59, "minute")
                            .add(59, "second") || null,
                      },
                    }))
                  }
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: { variant: "filled", className: "w-full" },
                  }}
                />
              </div>
            </LocalizationProvider>
          </div>
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`bg-theme-blue font-medium h-[40px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] ${
              !isFormValid || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Gerar relatório"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
