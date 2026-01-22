export const formatProperName = (name: string) => {
  const connectives = ['de', 'da', 'dos', 'e'];
  return name
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index > 0 && connectives.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};
