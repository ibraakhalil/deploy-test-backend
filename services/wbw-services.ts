export function wordsToAyahGrouper(words: any) {
  const results = words.reduce((acc: any, word: any) => {
    const { ayah_id, surah_id } = word;

    let ayahGroup = acc.find((group: any) => group.ayah_id === ayah_id && group.surah_id === surah_id);

    if (!ayahGroup) {
      ayahGroup = { ayah_id, surah_id, words: [] };
      acc.push(ayahGroup);
    }

    ayahGroup.words.push(word);

    return acc;
  }, []);

  return results;
}

export function wordsToPageV2Grouper(words: any[]) {
  const groupedResult = words.reduce((acc, curr, currentIndex) => {
    let page = acc.find((p: any) => p.page_v2 === curr.page_v2);
    if (!page) {
      page = { page_v2: curr.page_v2, lines: [] };
      acc.push(page);
    }

    let line = page.lines.find((l: any) => l.line_number === curr.line_number);
    if (!line) {
      line = { line_number: curr.line_number, words: [] };
      page.lines.push(line);
    }

    // Add ayah_marker field to each word
    const nextWord = words[currentIndex + 1];
    const isLastWordOfAyah = !nextWord || curr.ayah_id !== nextWord.ayah_id;

    // Add current word with ayah_marker field
    line.words.push({
      ...curr,
      ayah_marker: false, // Regular words are not ayah markers
    });

    // If this is the last word of the ayah, add the ayah marker
    if (isLastWordOfAyah) {
      line.words.push({
        ayah_id: curr.ayah_id,
        ayah_marker: true,
      });
    }

    return acc;
  }, []);

  return groupedResult;
}

export function wordsToPagesStructure(words: any) {
  return words.reduce((acc: any, curr: any) => {
    // Check if the current surah exists in the accumulator
    let surah = acc.find((s: any) => s.surah_id === curr.surah_id);
    if (!surah) {
      // If surah doesn't exist, add it
      surah = { surah_id: curr.surah_id, lines: [] };
      acc.push(surah);
    }

    // Check if the current line number exists in the surah's lines array
    let line = surah.lines.find((l: any) => l.line_number === curr.line_number);
    if (!line) {
      // If the line doesn't exist, add it
      line = { line_number: curr.line_number, words: [] };
      surah.lines.push(line);
    }

    line.words.push(curr);

    return acc;
  }, []);
}

export function transformWordsDataForV2(words: any[]): any[] {
  const pageMap = words.reduce(
    (pages, word) => {
      const pageNum = word.page_v2 ?? 0;
      const surahId = word.surah_id;
      const lineNum = word.line_number ?? '0';

      // Get or create page
      if (!pages.has(pageNum)) {
        pages.set(pageNum, {
          page_v2: pageNum,
          surahs: new Map(),
        });
      }
      const page = pages.get(pageNum)!;

      // Get or create surah
      if (!page.surahs.has(surahId)) {
        page.surahs.set(surahId, {
          surah_id: surahId,
          lines: new Map(),
        });
      }
      const surah = page.surahs.get(surahId)!;

      // Get or create line
      if (!surah.lines.has(lineNum)) {
        surah.lines.set(lineNum, {
          line_number: lineNum,
          words: [],
        });
      }

      // Add word to line
      surah.lines.get(lineNum)!.words.push(word);

      return pages;
    },
    new Map<
      number,
      {
        page_v2: number;
        surahs: Map<
          number,
          {
            surah_id: number;
            lines: Map<
              string,
              {
                line_number: string;
                words: any[];
              }
            >;
          }
        >;
      }
    >()
  );

  // Convert Maps to arrays and sort
  return Array.from(pageMap.values()).map((page: any) => ({
    page_v2: page.page_v2,
    surahs: Array.from(page.surahs.values()).map((surah: any) => ({
      surah_id: surah.surah_id,
      lines: Array.from(surah.lines.values()),
    })),
  }));
}
