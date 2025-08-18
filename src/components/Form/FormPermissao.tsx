'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { cadastro_permissao } from '@/schemas';
import { capitalize } from '@/utils/capitalize';

export default function FormPermissao() {
  const [form, setForm] = useState({
    nome: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastro_permissao.validate(form);
      toast.success('Cadastro da orientação realizado com sucesso!');
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
        Cadastro da orientação
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 w-full"
      >
        <div className="w-full flex items-center gap-4">
          <input
            type="text"
            placeholder="Nome da permissão"
            name="nome"
            value={form.nome ? capitalize(form.nome) : ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nome: e.target.value }))
            }
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
