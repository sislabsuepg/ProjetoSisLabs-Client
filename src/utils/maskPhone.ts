import { nonDigitCharacters } from '@/constants/regex';

/**
 * Função para formatar número de celular
 * @param number - Número de celular para formatar
 * @returns número de celular formatado
 * - Com código do país (13 dígitos): +XX (XX) XXXXX-XXXX
 * - Sem código do país (11 dígitos): (XX) XXXXX-XXXX
 */
export function maskPhone(number?: string): string {
  if (!number) return '';

  let value = number.replace(nonDigitCharacters, '');
  
  // Se tem 13 dígitos (código do país + área + telefone)
  if (value.length >= 11) {
    if (value.length >= 13 || (value.length >= 11 && value.startsWith('55'))) {
      // Formato internacional: +55 (42) 99988-7711
      value = value.replace(/^(\d{2})(\d{2})(\d{5})(\d{4}).*/, '+$1 ($2) $3-$4');
    } else {
      // Formato nacional: (42) 99988-7711
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    }
  } else if (value.length >= 7) {
    // Formato parcial nacional: (42) 99988
    value = value.replace(/^(\d{2})(\d{1,5})/, '($1) $2');
  } else if (value.length >= 2) {
    // Apenas código de área: (42
    value = value.replace(/^(\d{1,2})/, '($1');
  }

  return value;
}
