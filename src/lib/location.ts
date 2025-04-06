// src/lib/location.ts

// Mapping from country code (ISO 3166-1 alpha-2) to currency code (ISO 4217)
// This is a simplified list, expand as needed or use a library
const countryCurrencyMap: Record<string, string> = {
  AF: "AFN", // Afghanistan
  AL: "ALL", // Albanie
  DZ: "DZD", // Algérie
  AS: "USD", // Samoa américaines
  AD: "EUR", // Andorre
  AO: "AOA", // Angola
  AI: "XCD", // Anguilla
  AQ: "", // Antarctique (aucune devise universelle)
  AG: "XCD", // Antigua-et-Barbuda
  AR: "ARS", // Argentine
  AM: "AMD", // Arménie
  AW: "AWG", // Aruba
  AU: "AUD", // Australie
  AT: "EUR", // Autriche
  AZ: "AZN", // Azerbaïdjan
  BS: "BSD", // Bahamas
  BH: "BHD", // Bahreïn
  BD: "BDT", // Bangladesh
  BB: "BBD", // Barbade
  BY: "BYN", // Biélorussie
  BE: "EUR", // Belgique
  BZ: "BZD", // Belize
  BJ: "XOF", // Bénin
  BM: "BMD", // Bermudes
  BT: "BTN", // Bhoutan
  BO: "BOB", // Bolivie
  BA: "BAM", // Bosnie-Herzégovine
  BW: "BWP", // Botswana
  BR: "BRL", // Brésil
  BN: "BND", // Brunei
  BG: "BGN", // Bulgarie
  BF: "XOF", // Burkina Faso
  BI: "BIF", // Burundi
  CV: "CVE", // Cap-Vert
  KH: "KHR", // Cambodge
  CM: "XAF", // Cameroun
  CA: "CAD", // Canada
  KY: "KYD", // Îles Caïmans
  CF: "XAF", // République centrafricaine
  TD: "XAF", // Tchad
  CL: "CLP", // Chili
  CN: "CNY", // Chine
  CO: "COP", // Colombie
  KM: "KMF", // Comores
  CG: "XAF", // Congo
  CD: "CDF", // République démocratique du Congo
  CR: "CRC", // Costa Rica
  CI: "XOF", // Côte d'Ivoire
  HR: "HRK", // Croatie
  CU: "CUP", // Cuba
  CY: "EUR", // Chypre
  CZ: "CZK", // République tchèque
  DK: "DKK", // Danemark
  DJ: "DJF", // Djibouti
  DM: "XCD", // Dominique
  DO: "DOP", // République dominicaine
  EC: "USD", // Équateur
  EG: "EGP", // Égypte
  SV: "USD", // Salvador
  GQ: "XAF", // Guinée équatoriale
  ER: "ERN", // Érythrée
  EE: "EUR", // Estonie
  SZ: "SZL", // Eswatini
  ET: "ETB", // Éthiopie
  FJ: "FJD", // Fidji
  FI: "EUR", // Finlande
  FR: "EUR", // France
  GA: "XAF", // Gabon
  GM: "GMD", // Gambie
  GE: "GEL", // Géorgie
  DE: "EUR", // Allemagne
  GH: "GHS", // Ghana
  GR: "EUR", // Grèce
  GD: "XCD", // Grenade
  GT: "GTQ", // Guatemala
  GN: "GNF", // Guinée
  GW: "XOF", // Guinée-Bissau
  GY: "GYD", // Guyana
  HT: "HTG", // Haïti
  HN: "HNL", // Honduras
  HK: "HKD", // Hong Kong
  HU: "HUF", // Hongrie
  IS: "ISK", // Islande
  IN: "INR", // Inde
  ID: "IDR", // Indonésie
  IR: "IRR", // Iran
  IQ: "IQD", // Irak
  IE: "EUR", // Irlande
  IL: "ILS", // Israël
  IT: "EUR", // Italie
  JM: "JMD", // Jamaïque
  JP: "JPY", // Japon
  JO: "JOD", // Jordanie
  KZ: "KZT", // Kazakhstan
  KE: "KES", // Kenya
  KI: "AUD", // Kiribati
  KW: "KWD", // Koweït
  KG: "KGS", // Kirghizistan
  LA: "LAK", // Laos
  LV: "EUR", // Lettonie
  LB: "LBP", // Liban
  LS: "LSL", // Lesotho
  LR: "LRD", // Libéria
  LY: "LYD", // Libye
  LI: "CHF", // Liechtenstein
  LT: "EUR", // Lituanie
  LU: "EUR", // Luxembourg
  MG: "MGA", // Madagascar
  MW: "MWK", // Malawi
  MY: "MYR", // Malaisie
  MV: "MVR", // Maldives
  ML: "XOF", // Mali
  MT: "EUR", // Malte
  MH: "USD", // Îles Marshall
  MR: "MRU", // Mauritanie
  MU: "MUR", // Maurice
  MX: "MXN", // Mexique
  FM: "USD", // Micronésie
  MD: "MDL", // Moldavie
  MC: "EUR", // Monaco
  MN: "MNT", // Mongolie
};

export const getCurrencyFromCountry = (
  countryCode: string | null | undefined
): string | undefined => {
  if (!countryCode) return undefined;
  return countryCurrencyMap[countryCode.toUpperCase()];
};

export const freelancerTypes = [
  { value: "dev", label: "Développeur" },
  { value: "design", label: "Designer" },
  { value: "marketing", label: "Marketing" },
  { value: "writer", label: "Rédacteur" },
  { value: "consultant", label: "Consultant" },
  { value: "va", label: "Assistant Virtuel" },
  { value: "other", label: "Autre" },
];

// Placeholder function - Replace with actual API call if needed
export async function fetchCountryFromIP(
  ip: string | undefined
): Promise<string | null> {
  if (!ip) return null;
  console.log(
    "fetchCountryFromIP called with IP:",
    ip,
    "(Placeholder - Implement actual API call)"
  );
  // Example: Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  // --- START: Replace this block with your actual API call ---
  // Example using a hypothetical API structure
  /*
	try {
			const apiKey = process.env.IPGEOLOCATION_API_KEY;
			if (!apiKey) {
					 console.warn("IP Geolocation API key not set. Skipping auto-detection.");
					 return null;
			}
			// Replace URL and structure with your chosen API provider
			const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`);
			if (!response.ok) {
					console.error(`IP Geolocation API error: ${response.statusText}`);
					return null;
			}
			const data = await response.json();
			return data.country_code2 || null; // Adjust based on API response field
	} catch (error) {
			console.error("Error fetching country from IP:", error);
			return null;
	}
	*/
  // --- END: Replace this block ---

  // Placeholder return value (e.g., based on common dev locations or just null)
  if (ip === "127.0.0.1" || ip === "::1") return "FR"; // Default to France for localhost
  return null; // Return null if detection fails or isn't implemented
}
