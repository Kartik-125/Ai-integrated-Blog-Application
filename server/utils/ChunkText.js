export const chunkText = ({ text, chunkSize = 500, overlap = 50 }) => {
  if (!text) return [];

  const plainText = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return [];

  const words = plainText.split(" ");
  const step = Math.max(1, chunkSize - overlap);

  const chunks = [];

  for (let i = 0; i < words.length; i += step) {
    const chunkWords = words.slice(i, i + chunkSize);
    if (chunkWords.length === 0) break;

    chunks.push(chunkWords.join(" "));

    if (i + chunkSize >= words.length) break;
  }

  return chunks;
};