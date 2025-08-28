"use client";

import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { cadastro_orientacao } from "@/schemas";
import { IAcademico, ILaboratorio, IProfessor } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";

export default function FormOrientacao() {
  const [form, setForm] = useState({
    dataInicio: "",
    dataFim: "",
    idAluno: 0,
    idProfessor: 0,
    idLaboratorio: 0,
  });

  const [ra, setRa] = useState("");
  const [professores, setProfessores] = useState<IProfessor[]>([]);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);

  const [loading, setLoading] = useState(true);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    console.log(name, value);
    if (name === "ra") {
      setRa(value);
      return;
    }
    if (name === "idProfessor" || name === "idLaboratorio") {
      setForm((f) => ({ ...f, [name]: Number(value) }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiOnline.get(`/aluno?ra=${ra}`);
      if (res.data[0]?.id) {
        const formComAluno = { ...form, idAluno: res.data[0].id };
        await cadastro_orientacao.validate(formComAluno);
        await apiOnline.post("/orientacao", formComAluno);
        toast.success("Cadastro da orientação realizado com sucesso!");
        console.log("✅ Dados válidos:", formComAluno);
      } else {
        toast.error("RA não encontrado.");
        return;
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.message);
      } else {
        if (err.response?.data?.erros) {
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
    if (key === "idProfessor" || key === "idLaboratorio") {
      return value !== 0;
    }
    return value !== "";
  });

  useState(() => {
    const fetchData = async () => {
      try {
        const [professoresResponse, laboratoriosResponse] = await Promise.all([
          apiOnline.get("/professor").then((x) => x.data),
          apiOnline.get("/laboratorio").then((x) => x.data),
        ]);

        setProfessores(professoresResponse);
        setLaboratorios(laboratoriosResponse);
        console.log("Professores:", professoresResponse);
        console.log("Laboratórios:", laboratoriosResponse);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      }
    };

    fetchData();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        Cadastro da orientação
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="space-y-4">
          <div className="w-full flex items-center gap-4">
            <input
              type="date"
              placeholder="Data de início"
              name="dataInicio"
              value={form.dataInicio || ""}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />

            <input
              type="date"
              placeholder="Data final"
              name="dataFim"
              value={form.dataFim || ""}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />
          </div>

          <div className="w-full flex items-center gap-4">
            <input
              type="text"
              placeholder="RA do aluno"
              name="ra"
              value={ra}
              maxLength={13}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            />

            <select
              name="idProfessor"
              value={form.idProfessor}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            >
              <option value={0} disabled>
                Selecione o professor
              </option>
              {professores.map((professor) => (
                <option key={professor.id} value={Number(professor.id)}>
                  {professor.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex items-center gap-4">
            <select
              name="idLaboratorio"
              value={form.idLaboratorio}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
            >
              <option value={0} disabled>
                Selecione o laboratório
              </option>
              {laboratorios.map((lab) => (
                <option key={lab.id} value={Number(lab.id)}>
                  {lab.nome}
                </option>
              ))}
            </select>
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
