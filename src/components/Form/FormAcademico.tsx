"use client";

import { cadastro_academico } from "@/schemas";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiOnline } from "@/services/services";
import * as Yup from "yup";
import { ICurso, ApiResponse } from "@/interfaces/interfaces";
import { maskPhone } from "@/utils/maskPhone";
import { removeLetters } from "@/utils/removeLetters";
import { capitalize } from "@mui/material";

export default function FormAcademico() {
  const [form, setForm] = useState({
    nome: "",
    ra: "",
    email: "",
    telefone: "",
    idCurso: 0,
    anoCurso: 0,
    senha: "",
    repetirSenha: "",
  });

  const [cursos, setCursos] = useState<ICurso[]>([]);

  const [loading, setLoading] = useState(true);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let newValue: string | number = value;

    if (name === "ra" || name === "telefone") {
      if (!value) {
        newValue = "";
      } else {
        newValue = removeLetters(value);
      }
    } else if (name === "idCurso") {
      newValue = parseInt(value) || 0;
    } else if (name === "anoCurso") {
      newValue = parseInt(removeLetters(value)) || 0;
    }

    setForm((f) => ({ ...f, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ Dados válidos:", form);
    try {
      await cadastro_academico.validate({
        nome: form.nome,
        ra: form.ra,
        email: form.email,
        telefone: form.telefone,
        idCurso: form.idCurso,
        anoCurso: form.anoCurso,
        senha: form.senha,
      });
      await apiOnline.post("/aluno", form);
      toast.success("Cadastro acadêmico realizado com sucesso!");
      setForm({
        nome: "",
        ra: "",
        email: "",
        telefone: "",
        idCurso: 0,
        anoCurso: 0,
        senha: "",
        repetirSenha: "",
      });
      console.log("✅ Dados válidos:", form);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.message);
      } else {
        if (err.response.data.erros) {
          err.response.data.erros.forEach((error: string) => {
            toast.error(error);
          });
        } else {
          toast.error("Erro inesperado. Tente novamente.");
        }
      }
    }
  };

  const isFormValid = Object.entries(form).every(([key, value]) => {
    if (key === "email" || key === "telefone") {
      return true;
    }
    if (key === "idCurso" || key === "anoCurso") {
      return value !== 0;
    }
    if (key === "repetirSenha") {
      return value === form.senha && value !== "";
    }
    return typeof value === "string" && value.trim() !== "";
  });

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await apiOnline.get("/curso");
        const data: ICurso[] = Array.isArray(response)
          ? response
          : (response as ApiResponse).data || [];
        setCursos(data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        toast.error("Erro ao buscar cursos. Tente novamente.");
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  if (loading) {
    return;
  }

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        Cadastro do acadêmico
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="space-y-4">
          <div className="w-full flex items-center gap-4">
            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={form.nome ? capitalize(form.nome) : ""}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />

            <input
              type="text"
              name="ra"
              placeholder="RA"
              value={removeLetters(form.ra)}
              maxLength={13}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />
          </div>

          <div className="w-full flex items-center gap-4">
            <input
              type="text"
              name="email"
              placeholder="E-Mail"
              value={form.email}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />

            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={form.telefone ? maskPhone(form.telefone) : ""}
              maxLength={15}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />
          </div>

          <div className="w-full flex items-center gap-4">
            <select
              name="idCurso"
              value={form.idCurso}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            >
              <option value={0} disabled>
                Selecione o curso
              </option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="anoCurso"
              placeholder="Ano/Série"
              value={form.anoCurso}
              max={
                cursos.find((c) => c.id === Number(form.idCurso))?.anosMaximo ||
                0
              }
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />
          </div>
          <div className="w-full flex items-center gap-4">
            <input
              type="password"
              name="senha"
              id="senha"
              maxLength={6}
              placeholder="Senha"
              value={removeLetters(form.senha)}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />
            <input
              type="password"
              name="repetirSenha"
              id="repetirSenha"
              maxLength={6}
              placeholder="Repetir Senha"
              value={removeLetters(form.repetirSenha)}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />
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
