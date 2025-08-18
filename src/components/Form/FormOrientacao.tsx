'use client';

import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { cadastro_orientacao } from '@/schemas';
import { maskDate } from '@/utils/maskDate';

export default function FormOrientacao() {
  const [form, setForm] = useState({
    data_inicio: '',
    data_fim: '',
    aluno: '',
    professor: '',
    laboratorio: '',
  });

  const listAlunos = ['João Silva', 'Maria Souza'];
  const listProfessores = ['Prof. Carlos', 'Profa. Ana'];
  const listLaboratorios = ['Lab. IA', 'Lab. Redes'];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastro_orientacao.validate(form);
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
            placeholder="Data de início"
            name="data_inicio"
            value={maskDate(form.data_inicio)}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />

          <input
            type="text"
            placeholder="Data final"
            name="data_fim"
            value={maskDate(form.data_fim)}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
        </div>

        <div className="w-full flex items-center gap-4">
          <select
            name="aluno"
            value={form.aluno}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          >
            <option value="" disabled>
              Selecione o aluno
            </option>
            {listAlunos.map((aluno) => (
              <option key={aluno} value={aluno}>
                {aluno}
              </option>
            ))}
          </select>

          <select
            name="professor"
            value={form.professor}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          >
            <option value="" disabled>
              Selecione o professor
            </option>
            {listProfessores.map((professor) => (
              <option key={professor} value={professor}>
                {professor}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex items-center gap-4">
          <select
            name="laboratorio"
            value={form.laboratorio}
            onChange={handleChange}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          >
            <option value="" disabled>
              Selecione o laboratório
            </option>
            {listLaboratorios.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>
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
