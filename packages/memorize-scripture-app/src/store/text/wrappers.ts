import { apiBible } from "@/api";
import { BibleSummary } from "@/api/ApiBible";
import { setBibleSummaries, setBibleSummariesError, setBibleSummariesLoading } from "@/store/text/slice";
import type { RootState } from "@/store/index";

export const selectBibleSummaries = (s: RootState) => s.text.bibleSummaries

export const fetchAllBibles = async () => {
  setBibleSummariesLoading(true)
  setBibleSummariesError(false)
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
    setBibleSummaries(data)
  } catch (e) {
    console.error("Error fetching Bible summaries", e);
    setBibleSummariesError(true)
  }
  setBibleSummariesLoading(true)
};
