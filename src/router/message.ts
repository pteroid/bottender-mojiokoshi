import { line } from 'bottender/router';

export default line.message(async (context) => {
  await context.replyText('メッセージを受信しました');
});
