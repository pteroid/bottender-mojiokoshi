import { line } from 'bottender/router';
import { LineContext, LineEvent } from 'bottender';
import { imageHandler } from '../handler';

export default line.message(async (context: LineContext) => {
  const event = context.event as LineEvent;

  if (event.isImage) {
    await imageHandler(context);
  } else if (context.event.isVideo) {
    await context.replyText('動画を取得しました');
  } else {
    await context.replyText('画像、音声、動画のどれかを送ってよ！');
  }
});
