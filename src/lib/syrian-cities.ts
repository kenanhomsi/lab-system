/** Syrian governorates and major cities for address selection. */
export type SyrianCity = {
  value: string;
  ar: string;
  en: string;
};

export const SYRIAN_CITIES: SyrianCity[] = [
  { value: "دمشق", ar: "دمشق", en: "Damascus" },
  { value: "ريف دمشق", ar: "ريف دمشق", en: "Rif Dimashq" },
  { value: "حلب", ar: "حلب", en: "Aleppo" },
  { value: "حمص", ar: "حمص", en: "Homs" },
  { value: "حماة", ar: "حماة", en: "Hama" },
  { value: "اللاذقية", ar: "اللاذقية", en: "Latakia" },
  { value: "طرطوس", ar: "طرطوس", en: "Tartus" },
  { value: "إدلب", ar: "إدلب", en: "Idlib" },
  { value: "الرقة", ar: "الرقة", en: "Raqqa" },
  { value: "دير الزور", ar: "دير الزور", en: "Deir ez-Zor" },
  { value: "الحسكة", ar: "الحسكة", en: "Al-Hasakah" },
  { value: "درعا", ar: "درعا", en: "Daraa" },
  { value: "السويداء", ar: "السويداء", en: "As-Suwayda" },
  { value: "القنيطرة", ar: "القنيطرة", en: "Quneitra" },
];

export const SYRIAN_CITY_VALUES = SYRIAN_CITIES.map((city) => city.value) as [
  string,
  ...string[],
];

/**
 * Returns the localized label for a Syrian city value.
 */
export function getSyrianCityLabel(value: string, locale: string): string {
  const city = SYRIAN_CITIES.find((item) => item.value === value);
  if (!city) return value;
  return locale.startsWith("ar") ? city.ar : city.en;
}

/**
 * Returns Syrian city options for select dropdowns.
 */
export function getSyrianCityOptions(locale: string) {
  return SYRIAN_CITIES.map((city) => ({
    value: city.value,
    label: locale.startsWith("ar") ? city.ar : city.en,
  }));
}
