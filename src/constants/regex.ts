export const nonDigitCharacters = /\D/g;
export const fullNameRegex = /^\s*[A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})+\s*$/;
export const removeHtmlFromText = /(<([^>]+)>)/gi;
export const remove_numbers = /\d+/g;
export const removeSpecialCharacters = /[^\w\s]/gi;
