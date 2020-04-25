import { ImageAnnotatorClient } from '@google-cloud/vision/build/src';

export const visionText = async (
  imageBuffer: Buffer
): Promise<string | null> => {
  const client = new ImageAnnotatorClient();

  const [result] = await client.textDetection({
    image: { content: imageBuffer },
  });
  return result.fullTextAnnotation?.text || null;
};
