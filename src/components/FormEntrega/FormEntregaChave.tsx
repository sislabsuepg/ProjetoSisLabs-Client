"use client";

import { IAcademico, ILaboratorio, IOrientacao } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { maskPhone } from "@/utils/maskPhone";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

interface FormState {
  ra: string;
  senha: string;
  idLaboratorio: number;
  idAluno?: number;
}

export default function FormEntregaChave() {
  const [form, setForm] = useState<FormState>({
    ra: "",
    senha: "",
    idLaboratorio: 0,
    idAluno: 0,
  });
  const [aluno, setAluno] = useState<IAcademico | null>(null);
  const [validado, setValidado] = useState(false);
  const [orientacao, setOrientacao] = useState<IOrientacao | null>(null);
  const isFormValid =
    validado

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await apiOnline.post("/emprestimo", {
        idAluno: form.idAluno,
        idLaboratorio: form.idLaboratorio,
        aluno,
        laboratorio: orientacao?.laboratorio as ILaboratorio,
      });
      toast.success("Entrega de chave realizada com sucesso!");
      setForm({ ra: "", senha: "", idLaboratorio: 0, idAluno: 0 });
    } catch (err: unknown) {
        if(err?.response?.data?.erros){
          err.response.data.erros.forEach((err: string) => { toast.error(err) });
        }
      else toast.error("Erro ao enviar formulário");
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        🔑 Entrega de chave
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
              value={form.ra}
              inputProps={{ maxLength: 13 }}
              onChange={(e)=>{
                const { name, value } = e.target;
                let ra = value.replace(/\D/g, '');
                if (ra.length > 13) ra = ra.slice(0, 13);
                setForm((prev) => ({ ...prev, [name]: ra }));
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  try{
                    const buscaAluno = await apiOnline.get(`/aluno/${form.ra}`);
                    setForm((prev) => ({ ...prev, idAluno: buscaAluno.data.id }));
                    setAluno(buscaAluno.data);
                    const buscaOrientacao = await apiOnline.get<IOrientacao>(`/orientacao/aluno/${buscaAluno.data.id}`);
                    setOrientacao(buscaOrientacao.data);
                    setForm((prev) => ({ ...prev, idLaboratorio: buscaOrientacao.data.laboratorio?.id || 0 }));
                  } catch (error) {
                    error?.response?.data?.erros?.forEach((err: string) => toast.error(err));
                  }
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
              disabled={form.idAluno === 0}
              value={form.senha}
              onChange={(e)=>{
                const { name, value } = e.target;
                const senha = value.replace(/\D/g, '');
                if (senha.length > 6){
                  toast.error("A senha deve ter até 6 dígitos.");
                  return;
                } 
                  
                setForm((prev) => ({ ...prev, [name]: senha }));
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (form.senha.length < 4) {
                    toast.error("Senha deve ter pelo menos 4 caracteres");
                    return;
                  }
                  try{
                    const valido = await apiOnline.post("/aluno/login", {
                      ra: form.ra,
                      senha: form.senha,
                    });
                    setValidado(valido.data != null);
                    if (valido.data) {
                      toast.success("Aluno validado com sucesso");
                    }
                  } catch (error) {
                    error?.response?.data?.erros?.forEach((err: string) => toast.error(err));
                    setValidado(false);
                  }
                }
              }}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
            />

            <FormControl
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              variant="filled"
            >
              <InputLabel id="lab-label">Laboratório</InputLabel>
              <Select
                disabled={validado === false}
                labelId="lab-label"
                id="lab-select"
                value={orientacao?.laboratorio?.id || 0}
                onChange={(e: SelectChangeEvent) => {
                  setForm((prev) => ({ ...prev, idLaboratorio: Number(e.target.value) }));
                }}
              >
                <MenuItem value={form.idLaboratorio || 0}> {form.idLaboratorio !== 0 ? orientacao?.laboratorio?.numero : "-- Selecione uma opção --"}</MenuItem>
              </Select>
            </FormControl>
          </div>

          {form.ra && form.idLaboratorio && (
            <div className="w-full bg-theme-container rounded-[10px] p-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-normal text-theme-blue">Nome:</span>
                  <span className="font-normal text-theme-text">
                    {orientacao?.aluno?.nome || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-normal text-theme-blue">Curso:</span>
                  <span className="font-normal text-theme-text">
                    {aluno?.curso?.nome || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-normal text-theme-blue">E-mail:</span>
                  <span className="font-normal text-theme-text">
                    {aluno?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-normal text-theme-blue">Ano:</span>
                  <span className="font-normal text-theme-text">{aluno?.anoCurso? `${aluno.anoCurso}º ano` : "N/A"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-normal text-theme-blue">Telefone:</span>
                  <span className="font-normal text-theme-text">
                    {aluno?.telefone ? maskPhone(aluno?.telefone) : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-normal text-theme-blue">
                    Professor:
                  </span>
                  <span className="font-normal text-theme-text">
                    {orientacao?.professor?.nome || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
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
