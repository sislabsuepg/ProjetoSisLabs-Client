'use client';

import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { cadastro_professor } from '@/schemas';
import { capitalize, TextField } from '@mui/material';
import { apiOnline } from '@/services/services';
import { ApiError } from '@/utils/tipos';

export default function FormAcademico() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
  });

const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setForm((f) => ({ ...f, [name]: value }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastro_professor.validate(form);
      await apiOnline.post('/professor', form);
      toast.success('Cadastro do professor realizado com sucesso!');
      setForm({
        nome: '',
        email: '',
      });
      console.log('✅ Dados válidos:', form);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.message);
      } else {
        const error = err as ApiError;
        if (error.response?.data?.erros) {
          error.response.data.erros.forEach((e) => toast.error(e));
        } else {
          toast.error(error.message || "Erro inesperado. Tente novamente.");
        }
      }
    }
  };

  const isFormValid = Object.values(form).every((value) => value.trim() !== '');

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        Cadastro do professor
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="space-y-4">
          <div className="w-full flex items-center gap-4">
            <TextField id="filled-basic" label="Nome completo" variant="filled" type="text"
              name="nome"
              value={form.nome ? capitalize(form.nome) : ''}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />

            <TextField id="filled-basic" label="E-Mail" variant="filled" type="text"
              name="email"
              value={form.email}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />
          </div>
        </div>

        <div className="w-full flex items-center justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] 
              ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
