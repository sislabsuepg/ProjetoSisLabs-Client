import { nonDigitCharacters } from '@/constants/regex';

export function maskDate(val: string): string {
  if (!val) return '';

  // remove caracteres não numéricos
  const digits = val.replace(nonDigitCharacters, '');

  // 🔹 Se vier no formato YYYYMMDD (ex: 20250825), converte para dd/MM/yyyy
  if (/^\d{8}$/.test(digits)) {
    const year = digits.substring(0, 4);
    const month = digits.substring(4, 6);
    const day = digits.substring(6, 8);
    return `${day}/${month}/${year}`;
  }

  // 🔹 Se vier no formato ddMMyyyy (ex: 25082025), aplica a máscara dd/MM/yyyy
  return digits
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d{1,4})/, '$1/$2')
    .replace(/(\/\d{4})\d+$/, '$1');
}
