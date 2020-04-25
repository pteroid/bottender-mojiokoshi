import { Action, LineContext } from 'bottender';
import router from './router';

export default async function App(): Promise<Action<LineContext> | void> {
  return router;
}
