/**
 * Utilitário para gerenciar o estado de notificações lidas no localStorage
 */

interface ReadNotifications {
  eventos: number[]; // IDs dos eventos lidos
  recados: number[]; // IDs dos recados lidos
}

const STORAGE_KEY = 'sislabs_read_notifications';

/**
 * Obtém as notificações lidas do localStorage
 */
export function getReadNotifications(): ReadNotifications {
  if (typeof window === 'undefined') {
    return { eventos: [], recados: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { eventos: [], recados: [] };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao ler notificações do localStorage:', error);
    return { eventos: [], recados: [] };
  }
}

/**
 * Salva as notificações lidas no localStorage
 */
function saveReadNotifications(data: ReadNotifications): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar notificações no localStorage:', error);
  }
}

/**
 * Marca eventos como lidos
 */
export function markEventosAsRead(eventoIds: number[]): void {
  const current = getReadNotifications();
  const newEventos = Array.from(new Set([...current.eventos, ...eventoIds]));
  saveReadNotifications({
    ...current,
    eventos: newEventos,
  });
}

/**
 * Marca recados como lidos
 */
export function markRecadosAsRead(recadoIds: number[]): void {
  const current = getReadNotifications();
  const newRecados = Array.from(new Set([...current.recados, ...recadoIds]));
  saveReadNotifications({
    ...current,
    recados: newRecados,
  });
}

/**
 * Marca todas as notificações atuais como lidas
 */
export function markAllAsRead(eventoIds: number[], recadoIds: number[]): void {
  const current = getReadNotifications();
  const newData = {
    eventos: Array.from(new Set([...current.eventos, ...eventoIds])),
    recados: Array.from(new Set([...current.recados, ...recadoIds])),
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📝 Marcando notificações como lidas:', {
      eventosNovos: eventoIds,
      recadosNovos: recadoIds,
      eventosAntigos: current.eventos,
      recadosAntigos: current.recados,
      resultado: newData,
    });
  }
  
  saveReadNotifications(newData);
}

/**
 * Remove IDs de eventos que não existem mais (limpeza)
 */
export function cleanupEventos(existingIds: number[]): void {
  const current = getReadNotifications();
  const cleaned = current.eventos.filter(id => existingIds.includes(id));
  saveReadNotifications({
    ...current,
    eventos: cleaned,
  });
}

/**
 * Remove IDs de recados que não existem mais (limpeza)
 */
export function cleanupRecados(existingIds: number[]): void {
  const current = getReadNotifications();
  const cleaned = current.recados.filter(id => existingIds.includes(id));
  saveReadNotifications({
    ...current,
    recados: cleaned,
  });
}

/**
 * Limpa todas as notificações lidas
 */
export function clearAllReadNotifications(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar notificações do localStorage:', error);
  }
}

/**
 * Calcula quantas notificações não foram lidas
 */
export function calculateUnreadCount(
  eventoIds: number[],
  recadoIds: number[]
): number {
  const read = getReadNotifications();
  
  const unreadEventos = eventoIds.filter(id => !read.eventos.includes(id));
  const unreadRecados = recadoIds.filter(id => !read.recados.includes(id));
  
  const total = unreadEventos.length + unreadRecados.length;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔔 Calculando não lidas:', {
      totalEventos: eventoIds.length,
      totalRecados: recadoIds.length,
      eventosLidos: read.eventos,
      recadosLidos: read.recados,
      eventosNaoLidos: unreadEventos,
      recadosNaoLidos: unreadRecados,
      totalNaoLidas: total,
    });
  }
  
  return total;
}
