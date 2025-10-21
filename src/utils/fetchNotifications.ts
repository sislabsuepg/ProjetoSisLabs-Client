import { apiOnline } from "@/services/services";
import { useNotificationStore } from "@/store";
import { ApiResponse, IEvento, IRecado } from "@/components/Lists/types";

export async function fetchAndCountNotifications() {
  const {
    setEventos,
    setRecados,
    setCount,
    setLoading,
  } = useNotificationStore.getState();

  setLoading(true);

  try {
    const [eventosResponse, recadosResponse] = await Promise.allSettled([
      apiOnline.get<ApiResponse<IEvento[]>>("/evento"),
      apiOnline.get<ApiResponse<IRecado[]>>("/recado"),
    ]);

    let eventosCount = 0;
    let recadosCount = 0;

    if (eventosResponse.status === "fulfilled") {
      const orderedEventos = [...eventosResponse.value.data].sort(
        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
      );
      setEventos(orderedEventos);
      eventosCount = orderedEventos.length;
    }

    if (recadosResponse.status === "fulfilled") {
      const orderedRecados = [...recadosResponse.value.data].sort(
        (a, b) => a.id - b.id
      );
      setRecados(orderedRecados);
      recadosCount = orderedRecados.length;
    }

    setCount(eventosCount + recadosCount);

  } catch (err) {
    console.error("Erro inesperado:", err);
  } finally {
    setLoading(false);
  }
}
