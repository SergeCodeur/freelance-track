import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction formatDate réimplémentée sans date-fns
export function formatDate(
  date: Date | string | number,
  formatString: string = "PP"
): string {
  if (!date) return "";
  try {
    const d = new Date(date);

    // Gestion des formats de date courants
    switch (formatString) {
      case "PP": // Format standard français: 5 avr. 2023
        return `${d.getDate()} ${getShortMonthName(
          d.getMonth()
        )} ${d.getFullYear()}`;
      case "P": // Format court: 05/04/2023
        return `${padZero(d.getDate())}/${padZero(
          d.getMonth() + 1
        )}/${d.getFullYear()}`;
      case "PPP": // Format long: 5 avril 2023
        return `${d.getDate()} ${getFullMonthName(
          d.getMonth()
        )} ${d.getFullYear()}`;
      case "PPPP": // Format complet: mercredi 5 avril 2023
        return `${getDayName(d.getDay())} ${d.getDate()} ${getFullMonthName(
          d.getMonth()
        )} ${d.getFullYear()}`;
      case "d MMM yyyy": // Format personnalisé: 5 avr. 2023
        return `${d.getDate()} ${getShortMonthName(
          d.getMonth()
        )} ${d.getFullYear()}`;
      case "yyyy-MM-dd": // Format ISO: 2023-04-05
        return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(
          d.getDate()
        )}`;
      default:
        return d.toLocaleDateString("fr-FR");
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date invalide";
  }
}

// Fonctions auxiliaires pour formatDate
function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

function getShortMonthName(monthIndex: number): string {
  const months = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];
  return months[monthIndex];
}

function getFullMonthName(monthIndex: number): string {
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  return months[monthIndex];
}

function getDayName(dayIndex: number): string {
  const days = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  return days[dayIndex];
}

export function formatCurrency(
  amount: number,
  currencyCode: string = "EUR",
  locale: string = "fr-FR"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    // Fallback for potentially unsupported currency codes
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

// Placeholder for country name lookup based on code
export function getCountryName(code: string | null | undefined): string {
  if (!code) return "N/A";
  // In a real app, use a library like 'countries-list' or an API
  const countries: { [key: string]: string } = {
    FR: "France",
    BE: "Belgique",
    CH: "Suisse",
    LU: "Luxembourg",
    CA: "Canada",
    BJ: "Bénin",
    SN: "Sénégal",
    CI: "Côte d'Ivoire",
    // Add more as needed
  };
  return countries[code.toUpperCase()] || code;
}

// Helper to get status badge color
export function getStatusBadgeColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "partial":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

// Helper to get status text
export function getStatusText(status: string): string {
  switch (status?.toLowerCase()) {
    case "paid":
      return "Payé";
    case "pending":
      return "En attente";
    case "partial":
      return "Partiel";
    case "cancelled":
      return "Annulé";
    default:
      return "Inconnu";
  }
}
