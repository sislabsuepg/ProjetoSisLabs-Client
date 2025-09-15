import { nonDigitCharacters } from "@/constants/regex";

/**
 * Formata número de telefone (até 15 dígitos E.164) permitindo qualquer código de país.
 * Regras adotadas (foco em telefones BR, mas genérico p/ código do país):
 * - Até 11 dígitos: assume número nacional (AA + 9 dígitos) => (AA) 9XXXX-XXXX
 * - Entre 12 e 15 dígitos: primeiros 1–3 dígitos => código do país; restante => nacional (DD + restante)
 *   Mantemos o DDD (2 dígitos) e o restante vira o assinante (podendo ter 8–11 dígitos conforme país / plano numérico)
 * - Hífen dinâmico: última parte sempre com 4 dígitos quando possível.
 * - Formatação parcial enquanto o usuário digita.
 * Obs: Caso ultrapasse 15 dígitos, o excedente é ignorado.
 * @param number string opcional contendo dígitos e/ou caracteres soltos
 */
export function maskPhone(number?: string): string {
  if (!number) return "";

  let digits = number.replace(nonDigitCharacters, "");
  if (!digits) return "";

  // Limita a 15 dígitos (E.164)
  if (digits.length > 15) digits = digits.slice(0, 15);

  // Nacional (<= 11 dígitos)
  if (digits.length <= 11) {
    if (digits.length >= 11) {
      // (AA) 99999-9999
      return digits.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    }
    if (digits.length >= 7) {
      // (AA) 99999 (parcial sem hífen ainda)
      return digits.replace(
        /^(\d{2})(\d{1,5})(\d{0,4})?.*/,
        (m, ddd, part1, part2) => {
          if (part2) return `(${ddd}) ${part1}-${part2}`;
          return `(${ddd}) ${part1}`;
        }
      );
    }
    if (digits.length >= 3) {
      // (AA) 9XXX...
      return digits.replace(/^(\d{2})(\d{1,4})/, "($1) $2");
    }
    if (digits.length >= 2) {
      return digits.replace(/^(\d{1,2})/, "($1");
    }
    return digits; // 1 dígito apenas
  }

  // Internacional (> 11 dígitos): primeiros (len - 11) dígitos seriam o código, mas limitamos a 3
  let tentativeCountryLen = digits.length - 11; // cálculo inicial assumindo 11 para nacional
  if (tentativeCountryLen > 3) tentativeCountryLen = 3; // códigos de país têm no máximo 3 dígitos (E.164)
  if (tentativeCountryLen < 1) tentativeCountryLen = 1; // segurança

  const country = digits.slice(0, tentativeCountryLen);
  // Nacional (restante). Não limitamos rigidamente a 11 para permitir total de 15 dígitos.
  const national = digits.slice(tentativeCountryLen); // pode ser 10-12 dígitos dependendo do total
  const ddd = national.slice(0, 2);
  const subscriber = national.slice(2); // até 9 dígitos

  // Quebra dinâmica: sempre últimos 4 separados, se houver >4.
  let formattedSubscriber: string;
  if (subscriber.length > 4) {
    const prefix = subscriber.slice(0, subscriber.length - 4);
    const suffix = subscriber.slice(-4);
    formattedSubscriber = `${prefix}-${suffix}`;
  } else {
    formattedSubscriber = subscriber; // parcial
  }

  return `+${country} (${ddd}) ${formattedSubscriber}`.trim();
}
