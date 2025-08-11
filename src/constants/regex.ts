export const nonDigitCharacters = /\D/g;
export const cpf_regex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/;
export const cpf_regex2 = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const fullNameRegex = /^\s*[A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})+\s*$/;
export const removeHtmlFromText = /(<([^>]+)>)/gi;
export const remove_numbers = /\d+/g;
export const removeSpecialCharacters = /[^\w\s]/gi;
