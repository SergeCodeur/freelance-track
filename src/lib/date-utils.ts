// src/lib/date-utils.ts
export function getYearFromDate(date: Date | string | number): number {
  const d = new Date(date);
  return d.getFullYear();
}

export function getMonthFromDate(date: Date | string | number): number {
  const d = new Date(date);
  return d.getMonth();
}

export function formatMonth(date: Date | string | number): string {
  const d = new Date(date);
  // Tableau des noms de mois en français
  const months = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  return months[d.getMonth()];
}
