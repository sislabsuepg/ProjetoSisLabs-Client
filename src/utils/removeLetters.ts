export const removeLetters = (value: string) => {
  return value.replace(/\D/g, ''); // remove tudo que não for dígito
};
