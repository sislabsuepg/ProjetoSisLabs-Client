"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { TextField, CircularProgress } from "@mui/material"; 
import { Aluno } from "@/utils/tipos";
import { apiOnline } from "@/services/services";

export default function FormAcademicoRelatorio() {
  const [ra, setRa] = useState<string>(""); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const raLimpo = ra.trim();
    if (!raLimpo) {
      toast.warn("Por favor, digite o RA do acadêmico.");
      return;
    }

    setIsLoading(true);
    try {
      const responseAluno = await apiOnline.get<{ data: Aluno }>(`/aluno/${raLimpo}`);
      const aluno = responseAluno.data; 

      if (!aluno || !aluno.id) {
        toast.error("RA não encontrado. Verifique o número digitado.");
        setIsLoading(false);
        return;
      }

      const alunoId = aluno.id;
      
      const responseRelatorio = await apiOnline.get<Blob>(
        `/relatorio/Academico?alunoId=${alunoId}`, 
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([responseRelatorio]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_academico_${raLimpo}.pdf`);
      
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download do relatório iniciado!");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Erro ao gerar o relatório ou RA não encontrado.");
    } finally {
      setIsLoading(false);
      setRa(""); 
    }
  };

  const isFormValid = ra.trim() !== "";

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
       Gerar relatório - Acadêmico
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4 flex flex-col justify-between w-full h-full">
        <div className="w-full flex items-center gap-4">
          <TextField
            label="Digite o RA do Acadêmico"
            variant="filled"
            fullWidth
            value={ra}
            onChange={(e) => setRa(e.target.value)}
            disabled={isLoading}
            InputProps={{
              className: "ra-aluno font-normal text-[0.9rem] rounded-md"
            }}
          />
        </div>
        <div className="w-full flex items-center justify-end">
          <button type="submit" disabled={!isFormValid || isLoading} className={`bg-theme-blue font-medium h-[40px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] ${!isFormValid || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Gerar relatório"}
          </button>
        </div>
      </form>
    </div>
  );
}