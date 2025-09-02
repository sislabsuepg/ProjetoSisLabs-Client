"use client";

import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { cadastro_curso } from "@/schemas";
import { apiOnline } from "@/services/services";
import { ApiError } from "@/utils/tipos";
import { TextField } from "@mui/material";

export default function FormCurso() {
  const [form, setForm] = useState({
    nome: "",
    anosMaximo: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "anosMaximo") {
      setForm((f) => ({ ...f, [name]: Number(value) }));
    } else {
      setForm((f) => ({ ...f, [name]: value.trim() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastro_curso.validate(form);
      await apiOnline.post("/curso", {
        nome: form.nome,
        anosMax: form.anosMaximo,
      });
      toast.success("Cadastro do curso realizado com sucesso!");
      console.log("✅ Dados válidos:", form);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.message);
      } else {
        const error = err as ApiError;
        if (error.response?.data?.erros) {
          error.response.data.erros.forEach((e) => toast.error(e));
        } else {
          toast.error(error.message || "Erro inesperado. Tente novamente.");
        }
      }
    }
  };

  const isFormValid = Object.entries(form).every(([key, value]) => {
    if (key === "anosMaximo" && typeof value === "number") {
      return value > 0;
    } else {
      return String(value).trim() !== "";
    }
  });

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        Cadastro do curso
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="space-y-4">
          <div className="w-full flex items-center gap-4">
            <TextField id="filled-basic" label="Nome do curso" variant="filled" type="text"
              name="nome"
              value={form.nome ? form.nome : ""}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />

            <TextField id="filled-basic" label="Quantos anos tem o curso?" variant="filled" type="number"
              name="anosMaximo"
              value={form.anosMaximo > 0 ? form.anosMaximo : 1}
              inputProps={{ min: 1 }}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />
          </div>
        </div>

        <div className="w-full flex items-center justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] 
              ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
