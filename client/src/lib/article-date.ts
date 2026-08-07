// Article dates. Western numerals in both languages (spec §12.7), so the
// Arabic locale is pinned to the `-u-nu-latn` numbering system rather than
// letting the runtime pick Eastern Arabic digits.
export function formatArticleDate(value: string | Date, language: "en" | "ar"): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(language === "ar" ? "ar-EG-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
