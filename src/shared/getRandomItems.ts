export const getRandomItems = <T>(array: T[], count: number): T[] => {
  if (!array || array.length === 0) return [];

  const shuffled = [...array].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count);
};
