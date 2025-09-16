"use client";

import { ILaboratorio } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { removeLetters } from "@/utils/removeLetters";
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

interface FormState {
  ra: string;
  senha: string;
  idLaboratorio: number;
  idAluno?: number;
}

export default function FormEntregaPesquisa() {
  const [form, setForm] = useState<FormState>({
    ra: "",
    senha: "",
    idLaboratorio: 0,
    idAluno: 0,
  });
  const [validado, setValidado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);

  useEffect(() => {
    setLoading(true);
    try {
      const fetchLaboratorios = async () => {
        const response = await apiOnline.get<
          ILaboratorio[] | { data: ILaboratorio[] }
        >("/laboratorio?ativo=true&restrito=false");
        const resp = response as {
          data: ILaboratorio[] | { data?: ILaboratorio[] };
        };
        const inner = resp.data;
        const labs = Array.isArray(inner)
          ? inner
          : (inner as { data?: ILaboratorio[] }).data || [];
        setLaboratorios(labs);
        setLoading(false);
      };
      fetchLaboratorios();
    } catch (err: unknown) {
      const errObj2 = err as { response?: { data?: { erros?: string[] } } };
      if (errObj2?.response?.data?.erros) {
        errObj2.response.data.erros.forEach((er: string) => toast.error(er));
      } else {
        toast.error("Erro ao buscar laboratórios");
      }
      setLoading(false);
    }
  }, []);

  const isFormValid =
    form.idLaboratorio !== 0 &&
    form.ra.trim() !== "" &&
    form.senha.trim() !== "" &&
    form.idAluno !== 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      console.log("✅ Dados do formulário:", form);
      await apiOnline.post("/emprestimo", {
        idAluno: form.idAluno,
        idLaboratorio: form.idLaboratorio,
      });
      toast.success("Empréstimo realizado com sucesso!");
      setForm({ ra: "", senha: "", idLaboratorio: 0 });
      setValidado(false);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { erros?: string[] } } };
      if (errObj?.response?.data?.erros)
        errObj.response.data.erros.forEach((er: string) => toast.error(er));
    }
  };

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
        Laboratório para pesquisa
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="space-y-4">
          <div className="w-full flex items-center gap-4">
            <TextField
              id="ra"
              label="RA"
              variant="filled"
              type="text"
              name="ra"
              value={removeLetters(form.ra)}
              inputProps={{ maxLength: 13 }}
              onChange={(e) => {
                const value = removeLetters(e.target.value);
                if (value.length > 13) return;
                setForm((f) => ({ ...f, ra: value }));
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  await apiOnline
                    .get<{ data?: { id?: number } } | { id?: number }>(
                      `/aluno/${form.ra}`
                    )
                    .then(async (res) => {
                      const r = (res as { data?: { id?: number } }).data
                        ? (res as { data?: { id?: number } }).data
                        : (res as { id?: number });
                      if (r && r.id) {
                        const advertenciaResponse: { data: boolean } =
                          await apiOnline.get<{ data: boolean }>(
                            `/aluno/advertencias/${r.id}`
                          );
                        if (advertenciaResponse.data == true) {
                          toast.warning(
                            "Atenção: O aluno possui advertências registradas no ultimo mês."
                          );
                        }
                        setForm((f) => ({ ...f, idAluno: r.id! }));
                        console.log("🔍 Usuário encontrado:", r);
                      } else {
                        setValidado(false);
                        setForm((f) => ({ ...f, idAluno: 0 }));
                      }
                    })
                    .catch((err) => {
                      setValidado(false);
                      setForm((f) => ({ ...f, idAluno: 0 }));
                      (
                        err as { response?: { data?: { erros?: string[] } } }
                      )?.response?.data?.erros?.forEach((er: string) =>
                        toast.error(er)
                      );
                    });
                }
              }}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
            />

            <TextField
              id="senha"
              label="Senha"
              variant="filled"
              type="password"
              name="senha"
              value={form.senha}
              onChange={(e) => {
                const value = removeLetters(e.target.value);
                if (value.length > 6) return;
                setForm((f) => ({ ...f, senha: value }));
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (form.senha.length < 4) {
                    toast.error("Senha deve ter pelo menos 4 caracteres");
                    return;
                  }
                  const valido = await apiOnline
                    .post<unknown | { data?: unknown }>(
                      "/aluno/verificasenha",
                      {
                        login: form.ra,
                        senha: form.senha,
                      }
                    )
                    .then((res) => {
                      return (res as { data?: unknown }).data != null;
                    })
                    .catch((err) => {
                      (
                        err as { response?: { data?: { erros?: string[] } } }
                      )?.response?.data?.erros?.forEach((er: string) =>
                        toast.error(er)
                      );
                      return false;
                    });
                  setValidado(valido);
                  if (valido) toast.success("Usuário validado com sucesso");
                }
              }}
              disabled={form.idAluno === 0}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
            />
            <FormControl
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              variant="filled"
            >
              <InputLabel id="lab-label">Laboratório</InputLabel>
              <Select
                labelId="lab-label"
                id="lab-select"
                value={form.idLaboratorio}
                onChange={(e: SelectChangeEvent<number>) => {
                  setForm((f) => ({
                    ...f,
                    idLaboratorio: Number(e.target.value),
                  }));
                }}
                disabled={!validado}
              >
                <MenuItem value={0}>-- Selecione uma opção --</MenuItem>
                {laboratorios.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.numero} - {el.nome}
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
            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] 
              ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}
