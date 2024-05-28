import { it, describe, expect } from "vitest";
import init, { Condenser } from "@/compiled/text_condense";

init().then(() => {
  describe("numLineBreaks", () => {
    it("it should have truthy exports", () => {
      expect(new Condenser()).toBeTruthy();
    });
    it("1: it preserves all line breaks");
  });
});
