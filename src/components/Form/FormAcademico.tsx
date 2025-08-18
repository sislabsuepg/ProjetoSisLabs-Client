'use client';

import { cadastro_academico } from '@/schemas';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { maskPhone } from '@/utils/maskPhone';
import { removeLetters } from '@/utils/removeLetters';
import { capitalize } from '@mui/material';

export default function FormAcademico() {
  const [form, setForm] = useState({
    nome: '',
    ra: '',
    email: '',
    telefone: '',
    curso: '',
    ano: '',
  });

  const listCursos = [
    { id: 1, title: 'Engenharia de Software' },
    { id: 2, title: 'Engenharia de Computação' },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === 'ra' || name === 'ano' || name === 'telefone') {
      newValue = removeLetters(value);
    }

    setForm((f) => ({ ...f, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('✅ Dados válidos:', form);
    try {
      await cadastro_academico.validate(form);
      toast.success('Cadastro acadêmico realizado com sucesso!');
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
        Cadastro do acadêmico
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
            placeholder="Nome completo"
            value={form.nome ? capitalize(form.nome) : ''}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />

          <input
            type="text"
            name="ra"
            placeholder="RA"
            value={removeLetters(form.ra)}
            maxLength={8}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
        </div>

        <div className="w-full flex items-center gap-4">
          <input
            type="text"
            name="email"
            placeholder="E-Mail"
            value={form.email}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />

          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone ? maskPhone(form.telefone) : ''}
            maxLength={15}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
        </div>

        <div className="w-full flex items-center gap-4">
          <select
            name="curso"
            value={form.curso}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          >
            <option value="" disabled>
              Selecione o curso
            </option>
            {listCursos.map((curso) => (
              <option key={curso.id} value={curso.title}>
                {curso.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="ano"
            placeholder="Ano"
            value={removeLetters(form.ano)}
            maxLength={4}
            onChange={handleChange}
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
