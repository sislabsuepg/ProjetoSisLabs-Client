'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';

export default function Relatorios() {
  const [activeId, setActiveId] = useState(1);
  const [laboratorio, setLaboratorio] = useState('');
  const [tipoEntrada, setTipoEntrada] = useState<
    '' | 'emprestimo' | 'pesquisa' | 'ambos'
  >('');
  const [periodo, setPeriodo] = useState<{
    tipo: 'inicio' | 'data' | '';
    de?: string;
    ate?: string;
  }>({ tipo: '' });
  const isFormValid =
    tipoEntrada !== '' &&
    laboratorio !== '' &&
    (periodo.tipo === 'inicio' ||
      (periodo.tipo === 'data' && periodo.de && periodo.ate));

  const listButtons = [
    {
      id: 1,
      title: 'Laboratório',
    },
    {
      id: 2,
      title: 'Acadêmico',
    },
    {
      id: 3,
      title: 'Acadêmico por curso',
    },
  ];

  const laboratorios = [
    'Laboratório de Redes',
    'Laboratório de IA',
    'Laboratório de Programação',
    'Laboratório de Robótica',
  ];

  const renderFormulario = () => {
    switch (activeId) {
      case 1:
        return (
          <div className="w-full h-full flex flex-col justify-between">
            <form
              // onSubmit={}
              className="mt-4 space-y-4 w-full"
            >
              <div
                className={`${
                  tipoEntrada !== '' && 'border border-green-500'
                } relative bg-theme-container flex font-medium flex-col justify-between p-5 min-h-[100px] rounded-[15px] w-full`}
              >
                {tipoEntrada !== '' && (
                  <CheckCircleIcon className="absolute text-green-500 -top-3 -right-3" />
                )}
                <p className="font-semibold text-[1rem] text-theme-blue">
                  Tipo de entrada
                </p>
                <div className="flex items-center justify-between w-full max-w-[400px] mx-auto">
                  <label className="flex items-center cursor-pointer text-theme-text gap-2">
                    <input
                      type="radio"
                      name="tipoEntrada"
                      value="emprestimo"
                      checked={tipoEntrada === 'emprestimo'}
                      onChange={(e) =>
                        setTipoEntrada(e.target.value as typeof tipoEntrada)
                      }
                    />
                    Empréstimo
                  </label>
                  <label className="flex cursor-pointer text-theme-text items-center gap-2">
                    <input
                      type="radio"
                      name="tipoEntrada"
                      value="pesquisa"
                      checked={tipoEntrada === 'pesquisa'}
                      onChange={(e) =>
                        setTipoEntrada(e.target.value as typeof tipoEntrada)
                      }
                    />
                    Pesquisa
                  </label>
                  <label className="flex cursor-pointer text-theme-text items-center gap-2">
                    <input
                      type="radio"
                      name="tipoEntrada"
                      value="ambos"
                      checked={tipoEntrada === 'ambos'}
                      onChange={(e) =>
                        setTipoEntrada(e.target.value as typeof tipoEntrada)
                      }
                    />
                    Ambos
                  </label>
                </div>
              </div>

              <div
                className={`${
                  laboratorio !== '' && 'border border-green-500'
                } relative rounded-[15px] bg-theme-container `}
              >
                {laboratorio !== '' && (
                  <CheckCircleIcon className="absolute text-green-500 -top-3 -right-3" />
                )}
                <select
                  value={laboratorio}
                  onChange={(e) => setLaboratorio(e.target.value)}
                  className="w-full appearance-none font-medium bg-theme-container text-gray-600 px-4 py-3 rounded-[15px] focus:outline-none"
                >
                  <option value="" disabled>
                    Laboratório
                  </option>
                  {laboratorios.map((lab, index) => (
                    <option key={index} value={lab}>
                      {lab}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <KeyboardArrowDownIcon />
                </div>
              </div>

              <div
                className={`relative bg-theme-container flex font-medium flex-col justify-between p-5 min-h-[100px] rounded-[15px] w-full ${
                  periodo?.tipo === 'inicio' ||
                  (periodo?.tipo === 'data' && periodo.de && periodo.ate)
                    ? 'border border-green-500'
                    : ''
                }`}
              >
                {(periodo?.tipo === 'inicio' ||
                  (periodo?.tipo === 'data' && periodo.de && periodo.ate)) && (
                  <CheckCircleIcon className="absolute text-green-500 -top-3 -right-3" />
                )}

                <p className="font-semibold text-[1rem] text-theme-blue">
                  Período
                </p>

                <div className="flex flex-col gap-4 w-[90%] mx-auto">
                  <div className="flex items-center justify-center gap-5">
                    <label className="flex items-center cursor-pointer text-theme-text gap-2">
                      <input
                        type="radio"
                        name="periodoTipo"
                        value="inicio"
                        checked={periodo.tipo === 'inicio'}
                        onChange={(e) =>
                          setPeriodo({ tipo: e.target.value as 'inicio' })
                        }
                      />
                      Desde o início
                    </label>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer text-theme-text gap-2">
                        <input
                          type="radio"
                          name="periodoTipo"
                          value="data"
                          checked={periodo.tipo === 'data'}
                          onChange={(e) =>
                            setPeriodo((prev) => ({
                              ...prev,
                              tipo: e.target.value as 'data',
                            }))
                          }
                        />
                        Por data
                      </label>
                      {periodo.tipo === 'data' && (
                        <div className="flex gap-4 justify-between">
                          <div className="flex items-center gap-3">
                            <label className="text-sm text-theme-text">
                              Início:
                            </label>
                            <input
                              type="date"
                              value={periodo.de || ''}
                              onChange={(e) =>
                                setPeriodo((prev) => ({
                                  ...prev,
                                  de: e.target.value,
                                }))
                              }
                              className="border px-3 py-1 rounded-[20px] bg-theme-bg"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="text-sm text-theme-text">
                              Até:
                            </label>
                            <input
                              type="date"
                              value={periodo.ate || ''}
                              onChange={(e) =>
                                setPeriodo((prev) => ({
                                  ...prev,
                                  ate: e.target.value,
                                }))
                              }
                              className="border px-3 py-1 rounded-[20px] bg-theme-bg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="w-full flex items-center justify-end">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`disabled:bg-gray-400 bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-theme-white rounded-[10px]`}
              >
                Gerar relatório
              </button>
            </div>
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
    <div className="h-full flex flex-col w-full">
      <div className="w-full flex items-center justify-center gap-2">
        {listButtons.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item.id === activeId ? 'bg-theme-lightBlue' : 'bg-theme-blue'
            } h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="mt-10 w-full">
        <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
          Gerar relatório
        </p>
        {renderFormulario()}
      </div>
    </div>
  );
}
