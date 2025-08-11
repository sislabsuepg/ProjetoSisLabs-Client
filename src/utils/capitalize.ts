/**
 * Capitalize String
 * @param string - String que deseja aplicar a função
 * @returns retorno com a string já aplicado a função
 */
export function capitalize(string: string) {
  const capitalized: string[] = [];

  if (typeof string !== 'string') {
    return null;
  }

  if (!string) {
    return null;
  }

  string?.split(' ')?.forEach((word) => {
    if (word != 'II') {
      capitalized.push(
        word?.charAt(0).toUpperCase() + word?.slice(1)?.toLowerCase(),
      );
    } else {
      capitalized.push(
        word?.charAt(0).toUpperCase() + word?.slice(1)?.toUpperCase(),
      );
    }
  });

  return capitalized?.join(' ');
}

export function truncateString(text: string, length: number) {
  return text?.length > length ? `...${text?.slice(-length)}` : text;
}
