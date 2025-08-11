import { listOfInvalidCharacters } from '@/constants/uiConstants';

export function removeNumbers(
  value: string,
  shouldRemoveInvalidCharacters?: boolean,
) {
  // se um input deve receber apenas letras, essa função deve ser usada para remover os números digitados;
  const arrayOfValue = value?.split('');

  const filteredArrayOfValue = arrayOfValue?.filter((item) => {
    const isAnInvalidCharacter = listOfInvalidCharacters.some(
      (el) => el === item,
    );

    if (shouldRemoveInvalidCharacters) {
      // vai retornar todos os caracteres que:
      // - não forem números (isNaN) ou
      // - forem iguais a string espaço (" ")
      // - que isAnInvalidCharacter é igual falso

      return (
        (isNaN(item as unknown as number) || item === ' ') &&
        !isAnInvalidCharacter
      );
    }
    return isNaN(item as unknown as number) || item === ' ';
  });

  return filteredArrayOfValue?.join('');
}
