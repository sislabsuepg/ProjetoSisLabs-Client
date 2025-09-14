"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FormControl, InputLabel, MenuItem, Select, CircularProgress } from "@mui/material";
import { Aluno } from "@/utils/tipos";
import { apiOnline } from "@/services/services";

export default function FormAcademicoRelatorio() {
  const [alunoId, setAlunoId] = useState<string>(""); 
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAlunos, setIsFetchingAlunos] = useState(true);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        setIsFetchingAlunos(true);
        const response = await apiOnline.get<{ data: Aluno[] }>("/aluno");
        setAlunos(response.data || []);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Falha ao carregar a lista de acadêmicos.");
      } finally {
        setIsFetchingAlunos(false);
      }
    };
    fetchAlunos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoId) {
      toast.warn("Por favor, selecione um acadêmico.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiOnline.get<Blob>(
        `/relatorio/Academico?alunoId=${alunoId}`, 
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      
      const alunoSelecionado = alunos.find(a => a.id === Number(alunoId));
      link.setAttribute("download", `relatorio_academico_${alunoSelecionado?.ra || alunoId}.pdf`);
      
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download do relatório iniciado!");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Erro ao gerar o relatório.");
    } finally {
      setIsLoading(false);
      setAlunoId(""); 
    }
  };

  const isFormValid = alunoId !== "";

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
       📊 Gerar relatório - Acadêmico
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4 flex flex-col justify-between w-full h-full">
        <div className="w-full flex items-center gap-4">
          <FormControl className="w-full" variant="filled" disabled={isFetchingAlunos || isLoading}>
            <InputLabel id="aluno-select-label">RA do Acadêmico</InputLabel>
            <Select
              labelId="aluno-select-label"
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
            >
              <MenuItem value=""><em>-- Selecione uma opção --</em></MenuItem>
              {alunos.map((aluno) => (
                //Apesar de exibir o nome e o ra, o valor dos itens é o id por causa do serviço
                <MenuItem key={aluno.id} value={aluno.id}>{aluno.ra} - {aluno.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
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