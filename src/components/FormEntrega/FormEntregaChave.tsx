'use client';

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface FormState {
  ra: string;
  senha: string;
  laboratorio: string;
}

export default function FormEntregaChave() {
  const [form, setForm] = useState<FormState>({
    ra: '',
    senha: '',
    laboratorio: '',
  });

  const listaLab = [
    { id: 1, lab: "Lab A" },
    { id: 2, lab: "Lab B" },
    { id: 3, lab: "Lab C" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleLaboratorioChange = (e: SelectChangeEvent<string>) => {
    setForm(f => ({ ...f, laboratorio: e.target.value }));
  };

  const isFormValid = form.ra.trim() !== '' && form.senha.trim() !== '' && form.laboratorio.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      console.log("✅ Dados do formulário:", form);
      // Aqui você pode chamar sua API, ex:
      // await apiOnline.post("/entrega-chave", form);
      toast.success("Entrega de chave realizada com sucesso!");
      setForm({ ra: '', senha: '', laboratorio: '' });
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar formulário");
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
       🔑 Entrega de chave
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4 flex flex-col justify-between w-full h-full">
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

            <FormControl className="w-full font-normal p-3 text-[0.9rem] rounded-md" variant="filled">
              <InputLabel id="lab-label">Laboratório</InputLabel>
              <Select
                labelId="lab-label"
                id="lab-select"
                value={form.laboratorio}
                onChange={handleLaboratorioChange}
              >
                <MenuItem value="">
                  -- Selecione uma opção --
                </MenuItem>
                {listaLab.map(el => (
                  <MenuItem key={el.id} value={el.lab}>{el.lab}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {form.ra && form.senha && form.laboratorio && (
            <div className='w-full bg-theme-container rounded-[10px] p-4 flex flex-col gap-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center gap-2'>
                  <span className='font-normal text-theme-blue'>Nome:</span>
                  <span className='font-normal text-theme-text'>Gabriel Antonio Becher</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-normal text-theme-blue'>Curso:</span>
                  <span className='font-normal text-theme-text'>Engenharia de Software</span>
                </div>

                <div className='flex items-center gap-2'>
                  <span className='font-normal text-theme-blue'>E-mail:</span>
                  <span className='font-normal text-theme-text'>gabriel_becher@gmail.com</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-normal text-theme-blue'>Ano:</span>
                  <span className='font-normal text-theme-text'>3° ano</span>
                </div>

                <div className='flex items-center gap-2'>
                  <span className='font-normal text-theme-blue'>Telefone:</span>
                  <span className='font-normal text-theme-text'>(42) 9 9999-9999</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-normal text-theme-blue'>Professor:</span>
                  <span className='font-normal text-theme-text'>Raimundo Corrêa</span>
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
