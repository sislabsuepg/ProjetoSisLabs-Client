'use client';

import { cadastro_academico } from '@/schemas';
import { capitalize } from '@/utils/capitalize';
import { maskPhone } from '@/utils/maskPhone';
import { removeLetters } from '@/utils/removeLetters';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

export default function Cadastro() {
  const [activeId, setActiveId] = useState(1);
  const [form_academico, setForm_academico] = useState({
    nome: '',
    ra: '',
    email: '',
    telefone: '',
    curso: '',
    ano: '',
  });

  const listButtons = [
    { id: 1, title: 'Acadêmico' },
    { id: 2, title: 'Professor' },
    { id: 3, title: 'Laboratório' },
    { id: 4, title: 'Orientação/Mestrado' },
  ];

  const listCursos = [
    { id: 1, title: 'Engenharia de Software' },
    { id: 2, title: 'Engenharia de Computação' },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm_academico((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form_academico);
    try {
      await cadastro_academico.validate(form_academico);
      console.log('✅ Dados válidos:', form_academico);
      toast.success('Cadastro realizado com sucesso!');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error((err as Yup.ValidationError).message);
      } else {
        console.error(err);
        toast.error('Erro inesperado. Tente novamente.');
      }
    }
  };

  const renderFormulario = () => {
    switch (activeId) {
      case 1:
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
                  value={
                    form_academico.nome
                      ? (capitalize(form_academico.nome) as string)
                      : ''
                  }
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
                />

                <input
                  type="text"
                  name="ra"
                  placeholder="RA"
                  value={removeLetters(form_academico.ra)}
                  maxLength={8}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
                />
              </div>

              <div className="w-full flex items-center gap-4">
                <input
                  type="text"
                  name="email"
                  placeholder="E-Mail"
                  value={form_academico.email}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
                />

                <input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  value={
                    form_academico.telefone
                      ? (maskPhone(form_academico.telefone) as string)
                      : ''
                  }
                  maxLength={15}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
                />
              </div>

              <div className="w-full flex items-center gap-4">
                <select
                  name="curso"
                  value={form_academico.curso}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676]"
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
                  value={removeLetters(form_academico.ano)}
                  maxLength={4}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
                />
              </div>

              <div className="w-full flex items-center justify-end">
                <button
                  type="submit"
                  className={`disabled:bg-gray-400 bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-theme-white rounded-[10px]`}
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        );
      case 2:
        return <form className="mt-4 space-y-4">aaaaaa</form>;
      case 3:
        return (
          <form className="mt-4 space-y-4">
            <label className="block">
              Curso:
              <select className="border rounded p-2 w-full">
                <option>Engenharia de Software</option>
                <option>Sistemas de Informação</option>
              </select>
            </label>
            <label className="block">
              Período:
              <input type="text" className="border rounded p-2 w-full" />
            </label>
            <button
              type="submit"
              className="bg-theme-blue text-white px-4 py-2 rounded"
            >
              Gerar Relatório
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-start">
      <div className="w-full flex items-center justify-center gap-2">
        {listButtons?.map((item) => (
          <button
            key={item?.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item?.id === activeId ? 'bg-theme-lightBlue' : 'bg-theme-blue'
            } h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
          >
            {item?.title}
          </button>
        ))}
      </div>

      <div className="mt-10 w-full">{renderFormulario()}</div>
    </div>
  );
}
