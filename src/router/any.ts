import { line } from 'bottender/router';

export default line.any(async (context) => {
  await context.replyText('画像、音声、動画のどれかを送ってよ！');
});
