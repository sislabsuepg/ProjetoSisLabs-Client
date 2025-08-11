import { nonDigitCharacters } from '@/constants/regex';

/**
 * Função para formatar número de celular
 * @param number - Número de celular para formatar
 * @returns número de celular formatado
 */
export function maskPhone(number: string) {
  let value = number;

  if (typeof value !== 'string') {
    return null;
  }

  if (!value) {
    return null;
  }

  value = value.replace(nonDigitCharacters, '');
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d)(\d{4})$/, '$1-$2');

  return value;
}
