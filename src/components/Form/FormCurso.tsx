'use client';

import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { cadastro_curso } from '@/schemas';
import { removeLetters } from '@/utils/removeLetters';

export default function FormCurso() {
  const [form, setForm] = useState({
    nome: '',
    anos: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === 'anos') {
      newValue = removeLetters(value);
    }

    setForm((f) => ({ ...f, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastro_curso.validate(form);
      toast.success('Cadastro do professor realizado com sucesso!');
      console.log('✅ Dados válidos:', form);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.message);
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    }
  };

  const isFormValid = Object.values(form).every((value) => value.trim() !== '');

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        Cadastro do professor
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 w-full"
      >
        <div className="w-full flex items-center gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome do curso"
            value={form.nome ? form.nome : ''}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />

          <input
            type="text"
            name="anos"
            placeholder="Quantos anos tem o curso?"
            value={form.anos ? removeLetters(form.anos) : ''}
            onChange={handleChange}
            maxLength={2}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
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
