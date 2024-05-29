import { it, describe, expect } from "vitest";
import wasmBinary from "@/compiled/text_condense_bg.wasm?url";
import init, { Condenser } from "@/compiled/text_condense";

describe("numLineBreaks", () => {
  it("it should instantiate", async () => {
    console.log(wasmBinary);
    const fetchedResult = await fetch(wasmBinary);
    console.log(fetchedResult);
    // const inited = await init(fetchedResult)
    expect(fetchedResult).toBeTruthy();
  });
  it("1: it preserves all line breaks");
});

