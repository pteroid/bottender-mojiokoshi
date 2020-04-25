import { line } from 'bottender/router';
import { LineContext, LineEvent } from 'bottender';
import { imageHandler, audioHandler } from '../handler';

export default line.message(async (context: LineContext) => {
  const event = context.event as LineEvent;

  switch (event.message?.type) {
    case 'image':
      await imageHandler(context);
      break;
    case 'audio':
      await audioHandler(context);
      break;
    default:
      await context.replyText('画像、音声、動画のどれかを送ってよ！');
      break;
  }
});
