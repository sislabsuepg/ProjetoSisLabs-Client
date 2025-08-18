'use client';

import { cadastro_laboratorio } from '@/schemas';
import Switch from '@mui/material/Switch';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { removeLetters } from '@/utils/removeLetters';
import { styled } from '@mui/material';

export default function FormLaboratorio() {
  const [form, setForm] = useState({
    nome: '',
    numero: '',
    restrito: false,
  });

  const CustomSwitch = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: '#65C466',
          opacity: 1,
          border: 0,
          ...theme.applyStyles('dark', {
            backgroundColor: '#2ECA45',
          }),
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: '#E9E9EA',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
      ...theme.applyStyles('dark', {
        backgroundColor: '#39393D',
      }),
    },
  }));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === 'numero') {
      newValue = removeLetters(value);
    }

    setForm((f) => ({ ...f, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastro_laboratorio.validate(form);
      toast.success('Cadastro do laboratório realizado com sucesso!');
      console.log('✅ Dados válidos:', form);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.message);
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    }
  };

  const isFormValid = Object.values(form).every(
    (value) => String(value).trim() !== '',
  );

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        Cadastro do laboratório
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
            placeholder="Nome do laboratório"
            value={form.nome ? form.nome : ''}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />

          <input
            type="text"
            name="numero"
            placeholder="Número"
            value={removeLetters(form.numero)}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
        </div>

        <div className="w-full flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Restrito</span>
            <CustomSwitch
              checked={form.restrito}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, restrito: e.target.checked }))
              }
              name="restrito"
            />
          </label>
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
