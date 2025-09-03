"use client";

import { IPermissao } from "@/interfaces/interfaces";
import { cadastro_usuario } from "@/schemas";
import { apiOnline } from "@/services/services";
import { capitalize } from "@/utils/capitalize";
import { removeLetters } from "@/utils/removeLetters";
import { ApiError } from "@/utils/tipos";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FormUsuario() {
  const [form, setForm] = useState({
    nome: "",
    login: "",
    senha: "",
    repetirSenha: "",
    idPermissao: 0,
  });
  const [loading, setLoading] = useState(true);
  const [permissoes, setPermissoes] = useState<IPermissao[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastro_usuario.validate({
        nome: form.nome,
        login: form.login,
        senha: form.senha,
        idPermissao: form.idPermissao,
      });
      await apiOnline.post("/usuario", form);
      toast.success("Cadastro de usuário realizado com sucesso!");
      setForm({
        nome: "",
        login: "",
        senha: "",
        repetirSenha: "",
        idPermissao: 0,
      });
    } catch (err) {
      const error = err as ApiError;
      if (error.response?.data?.erros) {
        error.response.data.erros.forEach((e) => toast.error(e));
      } else {
        toast.error(error.message || "Erro inesperado. Tente novamente.");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((f) => ({ ...f, [name]: value }));
  };

  const isFormValid = Object.entries(form).every(([key, value]) => {
    if (key === "idPermissao") return value > 0;
    if (key === "repetirSenha") return value === form.senha;
    return value.trim() !== "";
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: IPermissao[] = await apiOnline
          .get("/permissao")
          .then((res) => res.data);
        setPermissoes(response);
      } catch (error) {
        toast.error("Erro ao buscar permissões");
      }
      setLoading(false);
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
        Cadastro do usuário
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="space-y-4">
          <div className="w-full flex items-center gap-4">
            <TextField
              id="filled-basic"
              label="Nome completo"
              variant="filled"
              type="text"
              name="nome"
              value={form.nome ? capitalize(form.nome) : ""}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
            />

            <TextField
              id="filled-basic"
              label="Login"
              variant="filled"
              type="text"
              name="login"
              value={form.login}
              inputProps={{ minLength: 3, maxLength: 20 }}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
            />
          </div>

          <div className="w-full flex items-center gap-4">
            <FormControl
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              variant="filled"
            >
              <InputLabel id="demo-simple-select-filled-label">
                Permissão
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                name="idPermissao"
                value={form.idPermissao}
                onChange={(e: SelectChangeEvent<number>) =>
                  setForm((f) => ({
                    ...f,
                    idPermissao: Number(e.target.value),
                  }))
                }
              >
                <MenuItem value="">-- Selecione uma opção --</MenuItem>
                {permissoes?.map((el) => (
                  <MenuItem key={el?.id} value={el?.id}>
                    {el?.nomePermissao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="w-full flex items-center gap-4">
            <TextField
              id="filled-basic"
              label="Senha"
              variant="filled"
              type="password"
              name="senha"
              inputProps={{ minLength: 6, maxLength: 12 }}
              value={removeLetters(form.senha)}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
            />

            <TextField
              id="filled-basic"
              label="Repetir Senha"
              variant="filled"
              type="password"
              name="repetirSenha"
              inputProps={{ minLength: 6, maxLength: 12 }}
              value={form.repetirSenha}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
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
