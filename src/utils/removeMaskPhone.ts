import { nonDigitCharacters } from '@/constants/regex';

/**
 * Função para remover a máscara do telefone e manter apenas os dígitos
 * @param phone - Número de telefone formatado
 * @returns número de telefone apenas com dígitos
 */
export function removeMaskPhone(phone?: string): string {
  if (!phone) return '';
  return phone.replace(nonDigitCharacters, '');
}
