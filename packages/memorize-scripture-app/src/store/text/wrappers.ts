import { apiBible } from "@/api";
import { BibleSummary } from "@/api/ApiBible";
import {
  setBibleSummaries,
  setBibleSummariesError,
  setBibleSummariesLoading,
  setChapterText,
  setChapterTextError,
  setChapterTextLoading,
} from "@/store/text/slice";
import type { RootState } from "@/store/index";
import { CustomJsonChapter, CustomJsonVerse } from "@/types/textTypes";

export const selectBibleSummaries = (s: RootState) => s.text.bibleSummaries;

const fetchApiBibles = async () => {
  console.log("fetching Bibles");
  setBibleSummariesLoading(true);
  setBibleSummariesError(false);
  try {
    const response = await apiBible.v1.getBibles(
      {},
      {
        headers: {
          "api-key": import.meta.env.VITE_API_BIBLE_KEY,
        },
      },
    );
    const data = (await response.json()).data as BibleSummary[];
    setBibleSummaries(data);
  } catch (e) {
    console.error("Error fetching Bible summaries", e);
    setBibleSummariesError(true);
  }
  setBibleSummariesLoading(true);
};

const fetchHelloAOBibles = async () => {
  fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then((request) => request.json())
    .then((availableTranslations) => {
      const relevantTranslations = availableTranslations.translations.filter(
        (translation: any) =>
          translation.language === "ell" ||
          translation.language === "eng" ||
          translation.language === "hbo",
      );
      console.log(
        "The Hello AO API has the following translations:",
        relevantTranslations,
      );
    });
};

const formatVerse = (verse: CustomJsonVerse): string =>
  `${verse.text.replace(/\n/g, `\n\n     [${verse.verseNumber}] `)}`;

const formatChapter = (chapter: CustomJsonChapter): string => {
  console.log("raw chapter: ", chapter);
  return " ".repeat(5) + "[1] " + chapter.verses.map(formatVerse).join(" ");
};

const fetchByzantineText = async () => {
  try {
    setChapterText(null);
    setChapterTextLoading(true);
    setChapterTextError(false);

    const chapter = await fetch(
      "/bible/byzantine/text/by-chapter/40-mark/1.json",
    )
      .then((request) => request.json() as Promise<CustomJsonChapter>)
      .then(formatChapter);
    setChapterText(chapter);
  } catch (e) {
    setChapterTextError(true);
  } finally {
    setChapterTextLoading(false);
  }
};

export const fetchAllBibles = async () => {
  Promise.all([fetchApiBibles(), fetchHelloAOBibles(), fetchByzantineText()]);
};
