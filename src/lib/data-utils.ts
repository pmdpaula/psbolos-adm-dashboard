export const getDateOnly = (dateString: string) => {
  // Extrai apenas a data (YYYY-MM-DD) sem interpretar como UTC
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
};
