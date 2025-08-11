import { nonDigitCharacters } from '@/constants/regex';

export function maskDate(val: string) {
  return val
    ?.replace(nonDigitCharacters, '')
    ?.replace(/(\d{2})(\d)/, '$1/$2')
    ?.replace(/(\d{2})(\d{1,4})/, '$1/$2')
    ?.replace(/(\/\d{4})\d+$/, '$1');
}
