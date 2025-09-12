import { apiOnline } from '@/services/services';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { ApiResponse, IEvento, IRecado } from '../Lists/types';
import style from './EventosAvisos.module.scss';

export default function EventosAvisos() {
  const [eventos, setEventos] = useState<IEvento[]>([]);
  const [recados, setRecados] = useState<IRecado[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = [
    'divider-green',
    'divider-orange',
    'divider-yellow',
    'divider-purple',
  ];

  useEffect(() => {
    async function fetchData() {
      Promise.allSettled([
        apiOnline.get<ApiResponse<IEvento[]>>('/evento'),
        apiOnline.get<ApiResponse<IRecado[]>>('/recado'),
      ]).then(([eventosResponse, recadosResponse]) => {
        if (eventosResponse.status === 'fulfilled') {
          setEventos(eventosResponse.value.data);
        } else {
          console.error('Erro ao buscar eventos:', eventosResponse.reason);
        }

        if (recadosResponse.status === 'fulfilled') {
          setRecados(recadosResponse.value.data);
        } else {
          console.error('Erro ao buscar recados:', recadosResponse.reason);
        }
        setLoading(false);
      });
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <div className="w-full flex items-center gap-4 h-full">
        <div className={`${style.container} w-1/2 flex flex-col`}>
          <p className="text-theme-blue font-medium">Eventos</p>
          <div
            className={`${style.scrollbarContainer} flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-1 h-[360px]`}
          >
            {eventos.length > 0 ? (
              eventos.map((evento, index) => {
                const colorClass = colors[index % colors.length];

                return (
                  <div
                    key={evento.id}
                    className={`${style.card} flex items-center gap-2 rounded-[15px]`}
                  >
                    <div
                      className={`${style.divider} ${style[colorClass]}`}
                    ></div>
                    <div>
                      <p className="font-medium text-[0.9rem] leading-4 mb-1">
                        {evento.nome}
                      </p>
                      <p className="font-normal text-[0.8rem] text-theme-text flex items-center gap-1">
                        <span>
                          {new Date(evento.data)
                            .toISOString()
                            .split('T')[0]
                            .replace(/-/g, '/')}
                        </span>
                        <span>às</span>
                        <span>
                          {new Date(evento.data).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-theme-text font-normal">
                Nenhum evento disponível.
              </p>
            )}
          </div>
        </div>

        <div className={`${style.container} w-1/2 flex flex-col`}>
          <p className="text-theme-blue font-medium">Avisos</p>
          <div
            className={`${style.scrollbarContainer} flex flex-col gap-2 overflow-y-auto p-1 h-[360px]`}
          >
            {recados.length > 0 ? (
              recados.map((recado, index) => {
                const colorClass = colors[index % colors.length];
                return (
                  <div
                    key={recado.id}
                    className={`${style.card} flex items-center gap-2 rounded-[15px]`}
                  >
                    <div
                      className={`${style.divider2} ${style[colorClass]}`}
                    ></div>
                    <div>
                      <p className="font-normal text-[0.9rem] text-theme-text">
                        {recado.texto}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-theme-text font-normal">
                Nenhum aviso disponível.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
