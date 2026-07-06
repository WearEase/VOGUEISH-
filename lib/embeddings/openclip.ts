const JINA_API_URL = "https://api.jina.ai/v1/embeddings";
const MODEL_ID = "jina-clip-v1";

export async function encodeImage(urlOrBase64: string): Promise<number[]> {
  const embeddings = await encodeImages([urlOrBase64]);
  return embeddings[0];
}

export async function encodeImages(urlsOrBase64: string[]): Promise<number[][]> {
  if (!urlsOrBase64.length) return [];

  const response = await fetch(JINA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.JINA_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL_ID,
      input: urlsOrBase64.map(image => ({ image })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jina AI Image Embedding failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.data
    .sort((a: { index: number }, b: { index: number }) => a.index - b.index)
    .map((d: { embedding: number[] }) => d.embedding);
}

export async function encodeText(text: string): Promise<number[]> {
  const response = await fetch(JINA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.JINA_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL_ID,
      input: [{ text }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jina AI Text Embedding failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}
