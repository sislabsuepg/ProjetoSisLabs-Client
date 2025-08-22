'use client';

import { cadastro_permissao } from '@/schemas';
import { capitalize } from '@/utils/capitalize';
import { styled } from '@mui/material';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

export default function FormPermissao() {
  const [form, setForm] = useState({
    nome: '',
    geral: false,
    cadastro: false,
    alteracao: false,
    relatorio: false,
    advertencia: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastro_permissao.validate(form);
      toast.success('Cadastro da permissao realizado com sucesso!');
      console.log('✅ Dados válidos:', form);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.message);
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    }
  };

  const isFormValid = form.nome.trim() !== '';

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

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        Cadastro de permissão de usuário
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="space-y-4">
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

          <div className="wrapper grid grid-cols-5 gap-4 mt-2">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Geral</span>
              <CustomSwitch
                checked={form.geral}
                onChange={() =>
                  setForm((prev) => ({ ...prev, geral: !prev.geral }))
                }
                name="geral"
              />
            </label>

            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Cadastro
              </span>
              <CustomSwitch
                checked={form.cadastro}
                onChange={() =>
                  setForm((prev) => ({ ...prev, cadastro: !prev.cadastro }))
                }
                name="cadastro"
              />
            </label>

            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Alteração
              </span>
              <CustomSwitch
                checked={form.alteracao}
                onChange={() =>
                  setForm((prev) => ({ ...prev, alteracao: !prev.alteracao }))
                }
                name="alteracao"
              />
            </label>

            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Relatório
              </span>
              <CustomSwitch
                checked={form.relatorio}
                onChange={() =>
                  setForm((prev) => ({ ...prev, relatorio: !prev.relatorio }))
                }
                name="relatorio"
              />
            </label>

            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Advertência
              </span>
              <CustomSwitch
                checked={form.advertencia}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    advertencia: !prev.advertencia,
                  }))
                }
                name="advertencia"
              />
            </label>
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
