export const removeLetters = (value: string) => {
  const arrayOfValue = value?.split('');

  const filteredArrayOfValue = arrayOfValue?.filter((item) => {
    if (isNaN(+item)) {
      return false;
    }

    return true;
  });

  return filteredArrayOfValue?.join('');
};
