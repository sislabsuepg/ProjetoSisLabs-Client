"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ApiError } from "@/utils/tipos";

export default function FormCursoRelatorio() {
  const [form, setForm] = useState({
    curso: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ Dados válidos:", form);
    try {
      if (form?.curso == '') {
        toast.success("O campo curso é obrigatório.");
      }

      console.log("✅ Dados válidos:", form);
    } catch (err) {
      const error = err as ApiError;
      if (error.response?.data?.erros) {
        error.response.data.erros.forEach((e) => toast.error(e));
      } else {
        toast.error(error.message || "Erro inesperado. Tente novamente.");
      }
    }
    finally {
      setForm({
        curso: "",
      });
    }
  };

const isFormValid = Object.values(form).every((value) => value !== "" && value !== null && value !== undefined);

  const listRA = [
    {
      id: 1,
      curso: 'Engenharia de Software'
    },
    {
      id: 2,
      curso: 'Engenharia de Computação'
    },
  ]

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
       📊 Gerar relatório por curso
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="w-full flex items-center gap-4">
          <FormControl className="w-full font-normal p-3 text-[0.9rem] rounded-md" variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label">Curso</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={form.curso} 
              onChange={(e) => setForm((f) => ({ ...f, curso: e.target.value }))}
            >
              <MenuItem value="">
                -- Selecione uma opção --
              </MenuItem>
              {listRA?.map((el) => (
                <MenuItem key={el?.id} value={el?.curso}>{el?.curso}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="w-full flex items-center justify-end">
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
