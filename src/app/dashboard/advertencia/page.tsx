"use client";

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { apiOnline } from "@/services/services";
import { Aluno, Laboratorio } from "@/utils/tipos";

interface EmprestimoAtivo {
  id: number;
  aluno: Aluno;
  laboratorio: Laboratorio;
}

const initialState = {
  emprestimoId: "",
  motivo: "",
  assuntoOutro: "",
  corpoOutro: "",
};

export default function Advertencia() {
  const [form, setForm] = useState(initialState);
  const [emprestimos, setEmprestimos] = useState<EmprestimoAtivo[]>([]);
  const [outroMotivo, setOutroMotivo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  //Buscar empréstimos ativos
  useEffect(() => {
    const fetchEmprestimosAbertos = async () => {
      try {
        setIsFetchingData(true);
        const response = await apiOnline.get<{ data: EmprestimoAtivo[] }>(
          "/emprestimo?ativo=true"
        );
        setEmprestimos(response.data || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Falha ao carregar alunos com empréstimos em aberto.");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchEmprestimosAbertos();
  }, []);

  const handleEmprestimoChange = (e: SelectChangeEvent<string>) => {
    setForm((f) => ({ ...f, emprestimoId: e.target.value }));
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOutroMotivo(value === "outro");
    setForm((f) => ({ ...f, motivo: value, assuntoOutro: "", corpoOutro: "" }));
  };

  const emprestimoSelecionado = emprestimos.find(
    (e) => e.id === Number(form.emprestimoId)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !emprestimoSelecionado) return;

    setIsLoading(true);

    let subject = "";
    let text = "";

    switch (form.motivo) {
      case "naoDevolucaoChave":
        subject = "Advertência: Não Devolução da Chave";
        text = `Olá, ${emprestimoSelecionado.aluno.nome}.\n\nEste é um aviso formal sobre a não devolução da chave do ${emprestimoSelecionado.laboratorio.nome} referente ao seu último empréstimo.\n\nPor favor, realize a devolução o mais breve possível.\n\nAtenciosamente,\nCoordenação SISLABS.`;
        break;
      case "naoApresentouSaida":
        subject = "Advertência: Não Apresentou Saída";
        text = `Olá, ${emprestimoSelecionado.aluno.nome}.\n\nConstatamos que você não registrou sua saída do ${emprestimoSelecionado.laboratorio.nome} no seu último acesso.\n\nÉ fundamental registrar tanto a entrada quanto a saída para o controle do laboratório. Pedimos sua atenção para os próximos acessos.\n\nAtenciosamente,\nCoordenação SISLABS.`;
        break;
      case "outro":
        subject = form.assuntoOutro;
        text = form.corpoOutro;
        break;
    }

    try {
      await apiOnline.post("/email/", {
        to: emprestimoSelecionado.aluno.email,
        subject,
        text,
        emprestimoId: emprestimoSelecionado.id,
      });

      toast.success("Advertência enviada com sucesso!");
      setForm(initialState);
      setOutroMotivo(false);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Falha ao enviar a advertência. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    form.emprestimoId !== "" &&
    form.motivo !== "" &&
    (form.motivo !== "outro" ||
      (form.assuntoOutro.trim() !== "" && form.corpoOutro.trim() !== ""));

  return (
    <div className="w-full flex flex-col h-full items-start">
      <p className="text-theme-blue font-semibold text-[1.2rem] w-full text-start">
        ⚠️ Emitir advertência
      </p>
      {/* ... Funciona pls ... */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 space-y-4 w-full h-full flex flex-col justify-between"
      >
        <div className="flex flex-col space-y-4 w-full">
          {/* Select de Alunos/Empréstimos */}
          <FormControl
            className="w-full"
            variant="filled"
            disabled={isFetchingData || isLoading}
          >
            <InputLabel>Acadêmico com empréstimo em aberto</InputLabel>
            <Select value={form.emprestimoId} onChange={handleEmprestimoChange}>
              <MenuItem value="">-- Selecione uma opção --</MenuItem>
              {emprestimos.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.aluno.ra} - {emp.aluno.nome} (Lab: {emp.laboratorio.nome}
                  )
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Motivos da advertência */}
          <div className="w-full bg-theme-container py-3 px-5 rounded-[10px] relative">
            <p className="font-semibold text-theme-blue mb-2">
              Motivo da advertência
            </p>
            <FormControl className="w-full">
              <RadioGroup value={form.motivo} onChange={handleRadioChange}>
                <FormControlLabel
                  value="naoDevolucaoChave"
                  control={<Radio />}
                  label="Não devolução da chave"
                />
                <FormControlLabel
                  value="naoApresentouSaida"
                  control={<Radio />}
                  label="Não apresentou a saída"
                />
                <FormControlLabel
                  value="outro"
                  control={<Radio />}
                  label="Outro"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Campos condicionais para outro motivo */}
          {outroMotivo && (
            <div className="w-full flex flex-col gap-4">
              <TextField
                label="Especifique o Assunto do E-mail"
                variant="filled"
                value={form.assuntoOutro}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assuntoOutro: e.target.value }))
                }
                className="w-full"
              />
              <TextField
                label="Escreva o Corpo do E-mail"
                variant="filled"
                multiline
                rows={4}
                inputProps={{ maxLength: 255 }}
                value={form.corpoOutro}
                onChange={(e) =>
                  setForm((f) => ({ ...f, corpoOutro: e.target.value }))
                }
                className="w-full"
              />
            </div>
          )}

          {emprestimoSelecionado && (
            <p className="font-normal">
              <span className="font-medium text-theme-blue">
                E-mail do destinatário:{" "}
              </span>
              <span className="text-theme-red">
                {emprestimoSelecionado.aluno.email ?? "E-mail não cadastrado"}
              </span>
            </p>
          )}
        </div>

        <div className="w-full flex items-center justify-end">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`bg-theme-blue font-medium h-[40px] flex items-center justify-center text-[0.9rem] w-full max-w-[170px] text-white rounded-[10px] ${
              !isFormValid || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Emitir advertência"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
