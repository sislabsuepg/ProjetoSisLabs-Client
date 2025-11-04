import { apiOnline } from "@/services/services";
import { useNotificationStore } from "@/store";
import { ApiResponse, IEvento, IRecado } from "@/components/Lists/types";
import { calculateUnreadCount, cleanupEventos, cleanupRecados } from "./notificationStorage";

export async function fetchAndCountNotifications() {
  const {
    setEventos,
    setRecados,
    setCount,
    setUnreadCount,
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
    let eventoIds: number[] = [];
    let recadoIds: number[] = [];

    if (eventosResponse.status === "fulfilled") {
      const orderedEventos = [...eventosResponse.value.data].sort(
        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
      );
      setEventos(orderedEventos);
      eventosCount = orderedEventos.length;
      eventoIds = orderedEventos.map(e => e.id);
      
      // Limpa IDs de eventos que não existem mais
      cleanupEventos(eventoIds);
    }

    if (recadosResponse.status === "fulfilled") {
      const orderedRecados = [...recadosResponse.value.data].sort(
        (a, b) => a.id - b.id
      );
      setRecados(orderedRecados);
      recadosCount = orderedRecados.length;
      recadoIds = orderedRecados.map(r => r.id);
      
      // Limpa IDs de recados que não existem mais
      cleanupRecados(recadoIds);
    }

    const totalCount = eventosCount + recadosCount;
    const unreadCount = calculateUnreadCount(eventoIds, recadoIds);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Notificações buscadas:', {
        totalEventos: eventosCount,
        totalRecados: recadosCount,
        totalNotificacoes: totalCount,
        naoLidas: unreadCount,
      });
    }
    
    setCount(totalCount);
    setUnreadCount(unreadCount);

  } catch (err) {
    console.error("Erro inesperado:", err);
  } finally {
    setLoading(false);
  }
}
