import { describe, it, expect } from "vitest";
import { chunkText } from "../utils/chunkText.js";

describe("chunkText", () => {
  it("returns an empty array for empty or missing text", () => {
    expect(chunkText({ text: "" })).toEqual([]);
    expect(chunkText({ text: null })).toEqual([]);
    expect(chunkText({ text: undefined })).toEqual([]);
  });

  it("strips HTML tags before chunking", () => {
    const chunks = chunkText({
      text: "<p>Hello <strong>world</strong></p>",
    });

    expect(chunks[0]).not.toContain("<p>");
    expect(chunks[0]).not.toContain("<strong>");
    expect(chunks[0]).toBe("Hello world");
  });

  it("returns a single chunk when the text is shorter than chunkSize", () => {
    const chunks = chunkText({ text: "one two three", chunkSize: 500 });

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe("one two three");
  });

  it("advances by (chunkSize - overlap) words between chunks", () => {
    // 25 numbered words, so the exact contents of each chunk are easy
    // to predict and check by hand.
    const words = Array.from({ length: 25 }, (_, i) => String(i));
    const text = words.join(" ");

    const chunks = chunkText({ text, chunkSize: 10, overlap: 3 });

    // step = 10 - 3 = 7, so the second chunk should start at word
    // index 7, not word index 10 — that's what "overlap" means.
    expect(chunks[0]).toBe(words.slice(0, 10).join(" "));
    expect(chunks[1]).toBe(words.slice(7, 17).join(" "));
  });

  it("stops once a chunk reaches the end of the text, with no trailing near-empty chunk", () => {
    const words = Array.from({ length: 12 }, (_, i) => String(i));
    const text = words.join(" ");

    const chunks = chunkText({ text, chunkSize: 10, overlap: 3 });

    // Without the end-of-text check, a naive implementation would
    // produce a third chunk containing only 1-2 leftover words.
    expect(chunks).toHaveLength(2);
    expect(chunks[1]).toBe(words.slice(7, 12).join(" "));
  });
});