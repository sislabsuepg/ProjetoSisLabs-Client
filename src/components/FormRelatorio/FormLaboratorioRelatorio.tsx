"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

export default function FormAcademicoRelatorio() {
  const [form, setForm] = useState({
    laboratorio: "",
    tipoEntrada: "",
    periodo: { de: null as Dayjs | null, ate: null as Dayjs | null },
  });

  const isFormValid =
    form.tipoEntrada !== "" &&
    form.laboratorio !== "" &&
    form.periodo.de !== null &&
    form.periodo.ate !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }
    toast.success("Relatório gerado com sucesso!");
    setForm({ laboratorio: "", tipoEntrada: "", periodo: { de: null, ate: null } });
  };

  const laboratorios = [
    'Laboratório de Redes',
    'Laboratório de IA',
    'Laboratório de Programação',
    'Laboratório de Robótica',
  ];

  return (
    <div className="w-full flex flex-col h-full">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        Gerar relatório - Laboratório
      </p>

      <form onSubmit={handleSubmit} className="h-full space-y-6 w-full flex flex-col justify-between">
        <div className="w-full flex flex-col gap-4">
          {/* Tipo de Entrada */}
          <div className={`w-full bg-theme-container py-3 px-5 rounded-[10px] relative`}>
            <p className="font-semibold text-theme-blue mb-2">
              Tipo de entrada
            </p>
            <FormControl className="w-full">
              <RadioGroup
                aria-labelledby="tipo-entrada-label"
                value={form.tipoEntrada}
                onChange={(e) => setForm(f => ({ ...f, tipoEntrada: e.target.value }))}
              >
                <FormControlLabel value="emprestimo" control={<Radio />} label="Empréstimo de chave" />
                <FormControlLabel value="pesquisa" control={<Radio />} label="Pesquisa" />
                <FormControlLabel value="ambos" control={<Radio />} label="Ambos" />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Laboratório + Datas */}
          <div className="w-full flex flex-col gap-4">

            {/* Select Laboratório */}
            <FormControl
              className="w-full relative"
              variant="filled"
            >
              <InputLabel>Laboratório</InputLabel>
              <Select
                value={form.laboratorio}
                onChange={(e) => setForm(f => ({ ...f, laboratorio: e.target.value }))}
              >
                <MenuItem value="">-- Selecione uma opção --</MenuItem>
                {laboratorios.map(el => (
                  <MenuItem key={el} value={el}>{el}</MenuItem>
                ))}
              </Select>
            </FormControl>


            {/* Datas lado a lado */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>

              <div className="flex gap-4 w-full">
                <DateField
                  label="Data inicial"
                  value={form.periodo.de}
                  onChange={(newValue) => setForm(f => ({ ...f, periodo: { ...f.periodo, de: newValue } }))}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      variant: "filled",
                      className: `w-full`,
                    }
                  }}

                />

                <DateField
                  label="Data final"
                  value={form.periodo.ate}
                  onChange={(newValue) => setForm(f => ({ ...f, periodo: { ...f.periodo, ate: newValue } }))}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      variant: "filled",
                      className: `w-full`,
                    }
                  }}

                />
              </div>
            </LocalizationProvider>
          </div>
        </div>

        {/* Botão */}
        <div className="w-full flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] 
              ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Gerar relatório
          </button>
        </div>

      </form>
    </div>
  );
}
