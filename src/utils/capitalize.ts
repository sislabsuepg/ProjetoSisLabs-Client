export function capitalize(string: string) {
  const capitalized: string[] = [];

  if (typeof string !== 'string' || !string) {
    return ''; // retorna string vazia, não null
  }

  string.split(' ').forEach((word) => {
    if (word !== 'II') {
      capitalized.push(
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      );
    } else {
      capitalized.push(
        word.charAt(0).toUpperCase() + word.slice(1).toUpperCase(),
      );
    }
  });

  return capitalized.join(' ');
}
