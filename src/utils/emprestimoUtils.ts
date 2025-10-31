/**
 * Utilitário para verificar empréstimos em aberto de dias anteriores
 */

/**
 * Verifica se uma data é de um dia anterior ao dia atual
 * @param date - Data a ser verificada
 * @returns true se a data for de um dia anterior
 */
export function isFromPreviousDay(date: Date | string): boolean {
  const targetDate = new Date(date);
  const today = new Date();
  
  // Zera as horas para comparar apenas as datas
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return targetDate.getTime() < today.getTime();
}

/**
 * Calcula quantos dias atrás foi a data
 * @param date - Data a ser verificada
 * @returns número de dias de diferença
 */
export function getDaysAgo(date: Date | string): number {
  const targetDate = new Date(date);
  const today = new Date();
  
  // Zera as horas para comparar apenas as datas
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Retorna uma mensagem amigável sobre há quanto tempo foi
 * @param date - Data a ser verificada
 * @returns string descritiva
 */
export function getTimeAgoMessage(date: Date | string): string {
  const daysAgo = getDaysAgo(date);
  
  if (daysAgo === 0) {
    return "Hoje";
  } else if (daysAgo === 1) {
    return "Ontem";
  } else if (daysAgo === 2) {
    return "Anteontem";
  } else if (daysAgo <= 7) {
    return `${daysAgo} dias atrás`;
  } else if (daysAgo <= 30) {
    const semanas = Math.floor(daysAgo / 7);
    return semanas === 1 ? "1 semana atrás" : `${semanas} semanas atrás`;
  } else {
    const meses = Math.floor(daysAgo / 30);
    return meses === 1 ? "1 mês atrás" : `${meses} meses atrás`;
  }
}

/**
 * Verifica se um empréstimo está em aberto há muito tempo (>= 7 dias)
 * @param date - Data de entrada do empréstimo
 * @returns true se estiver aberto há 7 dias ou mais
 */
export function isOverdueWarning(date: Date | string): boolean {
  return getDaysAgo(date) >= 7;
}

/**
 * Retorna a cor do alerta baseado em quantos dias atrás
 * @param date - Data a ser verificada
 * @returns objeto com classes CSS
 */
export function getAlertColor(date: Date | string): {
  bg: string;
  text: string;
  border: string;
} {
  const daysAgo = getDaysAgo(date);
  
  if (daysAgo >= 7) {
    // Muito tempo - vermelho
    return {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    };
  } else if (daysAgo >= 3) {
    // Atenção - laranja
    return {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-300",
    };
  } else if (daysAgo >= 1) {
    // Aviso - amarelo
    return {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    };
  }
  
  // Hoje - sem alerta
  return {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
  };
}
