import { LineContext } from 'bottender';
import { AudioMessage } from 'bottender/dist/line/LineEvent';
import { cloudSpeechToText } from '../api';


export default async (context: LineContext): Promise<void> => {
  const audioMessage = context.event.audio as AudioMessage;
  if (audioMessage.duration > 60000) {
    await context.replyText('1分以上の音声または動画は文字起こしできません');
    return;
  }

  const audioBuffer = await context.getMessageContent();
  if (!audioBuffer) {
    throw new Error('Cannot get audio buffer.');
  }

  const text = await cloudSpeechToText(audioBuffer);

  await context.replyText(
    text ||
      '音声を抽出できませんでした...\nモードを切り替える、または音を大きくしてみてください！',
  );
};
