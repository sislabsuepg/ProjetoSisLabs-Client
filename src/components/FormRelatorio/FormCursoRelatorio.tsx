"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FormControl, InputLabel, MenuItem, Select, CircularProgress } from "@mui/material";
import { ApiError, Curso } from "@/utils/tipos";
import { apiOnline } from "@/services/services";

export default function FormCursoRelatorio() {
  const [cursoId, setCursoId] = useState<string>("");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCursos, setIsFetchingCursos] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setIsFetchingCursos(true);
        const response = await apiOnline.get<{ data: Curso[] }>("/curso");
        setCursos(response.data || []);
      } catch (err) {
        toast.error("Falha ao carregar a lista de cursos.");
      } finally {
        setIsFetchingCursos(false);
      }
    };

    fetchCursos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoId) {
      toast.warn("Por favor, selecione um curso para gerar o relatório.");
      return;
    }

    setIsLoading(true);
    try {
      //chamada para acessar os cursos
      const response = await apiOnline.get<Blob>(
        `/relatorio/academicoPorCurso?cursoId=${cursoId}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      
      //Definindo o nome do arquivo
      const cursoSelecionado = cursos.find(c => c.id === Number(cursoId));
      const nomeArquivo = `relatorio_${cursoSelecionado?.nome.replace(/\s+/g, '_') || 'curso'}.pdf`;
      link.setAttribute("download", nomeArquivo);
      document.body.appendChild(link);
      link.click();

      //Limpar a url
      window.URL.revokeObjectURL(url);
      link.remove();
      
      toast.success("Download do relatório iniciado!");

    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Erro ao gerar o relatório. Verifique o servidor.");
    } finally {
      setIsLoading(false);
      setCursoId("");
    }
  };

  const isFormValid = cursoId !== "";

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
          <FormControl className="w-full font-normal" variant="filled" disabled={isFetchingCursos || isLoading}>
            <InputLabel id="curso-select-label">Curso</InputLabel>
            <Select
              labelId="curso-select-label"
              id="curso-select"
              value={cursoId} 
              onChange={(e) => setCursoId(e.target.value)}
            >
              <MenuItem value="">
                <em>-- Selecione uma opção --</em>
              </MenuItem>
              {cursos.map((curso) => (
                <MenuItem key={curso.id} value={curso.id}>{curso.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="w-full flex items-center justify-end">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`bg-theme-blue font-medium h-[40px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] 
              ${!isFormValid || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Gerar relatório"}
          </button>
        </div>
      </form>
    </div>
  );
}