export const removeLetters = (value?: string): string => {
  if (!value) return "";
  return value.replace(/\D/g, ""); // remove tudo que não for dígito
};
