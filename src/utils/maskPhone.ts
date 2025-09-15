import { nonDigitCharacters } from "@/constants/regex";

/**
 * Formata número de telefone (até 15 dígitos E.164) permitindo qualquer código de país.
 * Regras adotadas (foco em telefones BR, mas genérico p/ código do país):
 * - Até 11 dígitos: assume número nacional (AA + 9 dígitos) => (AA) 9XXXX-XXXX
 * - Entre 12 e 14 dígitos: interpreta (total - 11) primeiros dígitos como código do país (1–3)
 *   e os 11 finais como nacional => +CC (AA) 9XXXX-XXXX
 * - Se digitar 15 dígitos, apenas os 3 primeiros são considerados código do país e os 11 seguintes o nacional (excedente descartado)
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
  let tentativeCountryLen = digits.length - 11; // pode ser >3
  if (tentativeCountryLen > 3) tentativeCountryLen = 3; // códigos de país têm no máximo 3 dígitos (E.164)
  if (tentativeCountryLen < 1) tentativeCountryLen = 1; // segurança

  const country = digits.slice(0, tentativeCountryLen);
  let national = digits.slice(tentativeCountryLen); // pode ter >11 se usuário excedeu
  if (national.length > 11) national = national.slice(0, 11); // seguimos formato BR (2 + 9)
  const ddd = national.slice(0, 2);
  const subscriber = national.slice(2); // até 9 dígitos

  // Quebra subscriber em 5 + 4 quando completo ou parcial após 5
  let formattedSubscriber: string;
  if (subscriber.length > 5) {
    formattedSubscriber = `${subscriber.slice(0, 5)}-${subscriber.slice(5)}`;
  } else {
    formattedSubscriber = subscriber;
  }

  return `+${country} (${ddd}) ${formattedSubscriber}`.trim();
}
