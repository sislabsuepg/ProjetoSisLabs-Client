export const removeMask = (value: string) => {
  if (typeof value !== 'string') {
    return '';
  }

  if (!value) {
    return '';
  }

  return value?.replace(/\D/g, '')?.trim();
};
