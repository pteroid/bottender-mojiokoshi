import { LineContext } from 'bottender';
import { visionText } from '@/api';

export default async (context: LineContext): Promise<void> => {
  const imageBuffer = await context.getMessageContent();

  if (!imageBuffer) {
    throw new Error('Cannot get image buffer.');
  }

  const text = await visionText(imageBuffer);
  await context.replyText(text || 'テキストが抽出できませんでした');
};
