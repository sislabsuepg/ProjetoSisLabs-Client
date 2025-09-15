"use client";

import { useEffect, useState } from "react";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ILaboratorio } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function Cronograma() {
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    idLaboratorio: 0,
  });

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setForm({ ...form, idLaboratorio: Number(e.target.value) });
  };

  const isFormValid = form.idLaboratorio > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;
    async function salvarEvento() {
      try {
        // await apiOnline.post("/solocitar sala", {
        //   idLaboratorio: form.idLaboratorio
        // });
        toast.success("Sala solicitada com sucesso!");
      } catch (error) {
        toast.error("Erro ao solicitar sala.");
      }

    }
    salvarEvento();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const laboratoriosResponse = await apiOnline.get<ILaboratorio[]>("/laboratorio");
        console.log(laboratoriosResponse);
        setLaboratorios(laboratoriosResponse.data ?? []);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          const data = err.response?.data as { erros?: string[] } | undefined;
          if (data?.erros && data.erros.length > 0) {
            data.erros.forEach((e) => toast.error(e));
          } else {
            toast.error("Erro ao buscar dados. Tente novamente.");
          }
        } else {
          toast.error("Erro ao buscar dados. Tente novamente.");
        }
      } finally {
        setLoading(false);
      }
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
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-2">
        Solicitar sala
      </p>

      <FormControl className="w-full" variant="filled">
        <InputLabel>Laboratório</InputLabel>
        <Select
          name="idLaboratorio"
          value={form.idLaboratorio}
          onChange={handleSelectChange}
        >
          <MenuItem value={0}>-- Selecione uma opção --</MenuItem>
          {laboratorios.map((l) => (
            <MenuItem key={l.id} value={l.id}>
              {`${l.numero} - ${l.nome}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="w-full mt-10 flex items-center justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] 
          ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Solicitar sala
        </button>
      </div>
    </div>
  );
}
