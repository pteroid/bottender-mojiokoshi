import { Props } from 'bottender/dist/types';
import LineContext from 'bottender/dist/line/LineContext';

export default async (
  context: LineContext,
  props: Props<LineContext>
): Promise<void> => {
  console.error(props.error);

  if (!context.isReplied) {
    await context.replyText(
      '予期せぬエラーが発生しました。しばらく経ってからもう一度お試しください。ご迷惑をおかけして申し訳ありません。'
    );
  }

  if (process.env.NODE_ENV === 'production') {
    // send your error to your error tracker, for example: Sentry
  }
};
