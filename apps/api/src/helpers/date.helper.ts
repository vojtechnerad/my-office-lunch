export const getUtcDayBounds = (date: Date) => {
  const startOfDayUTC = new Date(date);
  startOfDayUTC.setUTCHours(0, 0, 0, 0);

  const endOfDayUTC = new Date(date);
  endOfDayUTC.setUTCHours(23, 59, 59, 999);

  return { startOfDayUTC, endOfDayUTC };
};
