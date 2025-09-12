import { apiOnline } from "@/services/services";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { IEvento, IRecado } from "../Lists/types";

export default function EventosAvisos() {
  const [eventos, setEventos] = useState<IEvento[]>([]);
  const [recados, setRecados] = useState<IRecado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      Promise.allSettled([
        apiOnline.get<IEvento[]>("/evento"),
        apiOnline.get<IRecado[]>("/recado"),
      ]).then(([eventosResponse, recadosResponse]) => {
        if (eventosResponse.status === "fulfilled") {
          setEventos(eventosResponse.value.data);
        }
        if (recadosResponse.status === "fulfilled") {
          setRecados(recadosResponse.value.data);
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
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-2">
        📝 Eventos e Avisos
      </p>
      {eventos.length === 0 && recados.length === 0 && (
        <p className="text-theme-gray font-normal">
          Nenhum evento ou aviso disponível.
        </p>
      )}
      {eventos.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg text-theme-darkBlue mb-2">
            Eventos
          </h2>
          <ul>
            {eventos.map((evento) => (
              <li key={evento.id} className="text-theme-gray font-normal mb-2">
                <div className="bg-blue-100 rounded-md p-4 shadow-sm">
                  {evento.nome} -{" "}
                  {new Date(evento.data)
                    .toISOString()
                    .split("T")[0]
                    .replace(/-/g, "/")}{" "}
                  às{" "}
                  {new Date(evento.data).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {recados.length > 0 && (
        <div>
          <h2 className="font-semibold text-[1.2rem] text-theme-blue mb-2 mt-5">
            Avisos
          </h2>
          <ul>
            {recados.map((recado) => (
              <li key={recado.id} className="text-theme-gray font-normal mb-2">
                <div className="bg-blue-100 rounded-md p-4 shadow-sm">
                  {recado.texto}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
