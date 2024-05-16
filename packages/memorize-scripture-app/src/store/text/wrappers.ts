import { apiBible } from "@/api";
import { BibleSummary } from "@/api/ApiBible";
import {
  setBibleSummaries,
  setBibleSummariesError,
  setBibleSummariesLoading,
} from "@/store/text/slice";
import type { RootState } from "@/store/index";

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
        (translation) =>
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

export const fetchAllBibles = async () => {
  Promise.all([fetchApiBibles(), fetchHelloAOBibles()]);
};
