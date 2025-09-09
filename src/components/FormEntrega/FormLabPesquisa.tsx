"use client";

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
}

export default function FormEntregaPesquisa() {
  const [form, setForm] = useState<FormState>({
    ra: "",
    senha: "",
    idLaboratorio: 0,
  });

  const listaLab = [
    { id: 1, lab: "Lab A" },
    { id: 2, lab: "Lab B" },
    { id: 3, lab: "Lab C" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (e instanceof HTMLSelectElement) {
      setForm((f) => ({ ...f, laboratorio: value }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const isFormValid = form.idLaboratorio !== 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      console.log("✅ Dados do formulário:", form);
      // Aqui você pode chamar sua API, ex:
      // await apiOnline.post("/entrega-chave", form);
      toast.success("Entrega de chave realizada com sucesso!");
      setForm({ laboratorio: "" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar formulário");
    }
  };

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
              value={form.ra}
              inputProps={{ maxLength: 13 }}
              onChange={handleChange}
              className="w-full font-normal p-3 text-[0.9rem] rounded-md"
            />

            <TextField
              id="senha"
              label="Senha"
              variant="filled"
              type="text"
              name="senha"
              value={form.senha}
              onChange={handleChange}
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
                onChange={handleChange}
              >
                <MenuItem value={0}>-- Selecione uma opção --</MenuItem>
                {listaLab.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.lab}
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
