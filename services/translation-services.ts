export function formatVerseTranslations(verses: any[], requestedTranslations: string[]) {
  return verses.reduce((acc: any, verse: any) => {
    const { ayah_id, surah_id } = verse;
    const verseKey = `${surah_id}:${ayah_id}`;

    if (!acc[verseKey]) {
      acc[verseKey] = [];
    }

    requestedTranslations.map(value => {
      acc[verseKey].push({
        value: value,
        text: verse[value],
      });
    });

    return acc;
  }, {});
}

interface TranslationItem {
  value: string;
  text: string | null;
}

interface FormattedVerse {
  ayah_id: number;
  surah_id: number;
  translations: TranslationItem[];
}

export function transformTranslations(verses: any[], requestedTranslations: string[]): FormattedVerse[] {
  return verses.reduce((acc: FormattedVerse[], verse: any) => {
    const { ayah_id, surah_id, ...translations } = verse;

    const verseTranslations = requestedTranslations
      .map(value => ({
        value,
        text: translations[value] || null,
      }))
      .filter(translation => translation.text !== null);

    acc.push({
      ayah_id,
      surah_id,
      translations: verseTranslations,
    });

    return acc;
  }, []);
}
