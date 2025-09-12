"use client";

import { cadastro_academico } from "@/schemas";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiOnline } from "@/services/services";
import { ICurso, ApiResponse } from "@/interfaces/interfaces";
import { maskPhone } from "@/utils/maskPhone";
import { removeLetters } from "@/utils/removeLetters";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { capitalize } from "@/utils/capitalize";
import { ApiError } from "@/utils/tipos";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const anoMax = cursos.find((c) => c.id === Number(form.idCurso))?.anosMaximo || 0;
      newValue = Math.min(parseInt(value) || 0, anoMax);
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
      const error = err as ApiError;
      if (error.response?.data?.erros) {
        error.response.data.erros.forEach((e) => toast.error(e));
      } else {
        toast.error(error.message || "Erro inesperado. Tente novamente.");
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
        setLoading(false);

      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        toast.error("Erro ao buscar cursos. Tente novamente.");
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
       📝 Cadastro do acadêmico
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="space-y-4">
          <div className="w-full flex md:flex-row flex-col items-center gap-4">
            <TextField id="filled-basic" label="Nome completo" variant="filled" type="text"
              name="nome"
              value={form.nome ? capitalize(form.nome) : ""}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />

            <TextField id="filled-basic" label="RA" variant="filled" type="text"
              name="ra"
              value={removeLetters(form.ra)}
              inputProps={{ maxLength: 13 }}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />
          </div>

          <div className="w-full flex items-center gap-4 md:flex-row flex-col">
            <TextField id="filled-basic" label="E-Mail" variant="filled" type="text"
              name="email"
              value={form.email}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />

            <TextField id="filled-basic" label="Telefone" variant="filled" type="text"
              name="telefone"
              value={form.telefone ? maskPhone(form.telefone) : ""}
              inputProps={{ maxLength: 15 }}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />
          </div>

          <div className="w-full flex items-center gap-4 md:flex-row flex-col">
            <FormControl className="w-full font-normal p-3 text-[0.9rem] rounded-md" variant="filled" >
              <InputLabel id="demo-simple-select-filled-label">Curso</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                name="idCurso"
                value={form.idCurso}
                onChange={(e: SelectChangeEvent<number>) =>
                  setForm(f => ({ ...f, idCurso: Number(e.target.value) }))
                }
              >
                <MenuItem value="">
                  -- Selecione uma opção --
                </MenuItem>
                {cursos?.map((el) => (
                  <MenuItem key={el?.id} value={el?.id}>{el?.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField id="filled-basic" label="Ano/Série" variant="filled" type="number"
              name="anoCurso"
              value={form.anoCurso}
              inputProps={{
                max: cursos.find((c) => c.id === Number(form.idCurso))?.anosMaximo || 0,
                min: 1
              }}

              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />
          </div>

          <div className="w-full flex items-center gap-4 md:flex-row flex-col">
            <TextField id="filled-basic" label="Senha" variant="filled" type="password"
              name="senha"
              inputProps={{ maxLength: 6 }}
              value={removeLetters(form.senha)}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />

            <TextField id="filled-basic" label="Repetir Senha" variant="filled" type="password"
              name="repetirSenha"
              inputProps={{ maxLength: 6 }}
              value={removeLetters(form.repetirSenha)}
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
