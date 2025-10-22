'use client';

import { cadastro_laboratorio } from '@/schemas';
import Switch from '@mui/material/Switch';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { apiOnline } from '@/services/services';
import { styled, TextField } from '@mui/material';
import { capitalize } from '@/utils/capitalize';
import { ApiError } from '@/utils/tipos';

type FormAcademicoProps = {
  handleCloseModal: () => void;
};

export default function FormLaboratorio({ handleCloseModal }: FormAcademicoProps) {
  const [form, setForm] = useState({
    nome: '',
    numero: '',
    restrito: false,
    gerarHorarios: false,
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | boolean = value;
    if (name === "nome" || name === "numero") {
      newValue = capitalize(value);
    }

    setForm((f) => ({ ...f, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastro_laboratorio.validate(form);
      await apiOnline.post('/laboratorio', form);
      toast.success('Cadastro do laboratório realizado com sucesso!');
      setForm({
        nome: '',
        numero: '',
        restrito: false,
        gerarHorarios: false,
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

  const isFormValid = Object.values(form).every(
    (value) => String(value).trim() !== '',
  );

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
       Cadastro do laboratório
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-4 flex flex-col justify-between w-full h-full"
      >
        <div className="space-y-4">
          <div className="w-full flex items-center gap-4">
            <TextField id="filled-basic" label="Nome do laboratório" variant="filled" type="text"
              name="nome"
              value={form.nome ? capitalize(form.nome) : ''}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />

            <TextField id="filled-basic" label="Número" variant="filled" type="text"
              name="numero"
              value={form.numero}
              onChange={handleChange} className="w-full font-normal p-3 text-[0.9rem] rounded-md" />
          </div>

          <div className="w-full flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                O laboratório é restrito?
              </span>
              <CustomSwitch
                checked={form.restrito}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, restrito: e.target.checked }))
                }
                name="restrito"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                O laboratório deve gerar horários automaticamente?
              </span>
              <CustomSwitch
                checked={form.gerarHorarios}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, gerarHorarios: e.target.checked }))
                }
                name="gerarHorarios"
              />
            </label>
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <button
            type="button"
           onClick={handleCloseModal}
            className={`bg-theme-red font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px]`}
          >
            Cancelar
          </button>
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
