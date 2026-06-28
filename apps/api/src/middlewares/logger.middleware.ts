import { serializeError } from 'serialize-error';
import { LogLayer, MockLogLayer } from 'loglayer';
import {
  getSimplePrettyTerminal,
  moonlight,
} from '@loglayer/transport-simple-pretty-terminal';
import { env } from '../env';

export function logger() {
  if (env.LOG_LEVEL === 'silent') {
    return new MockLogLayer();
  }

  return new LogLayer({
    errorSerializer: serializeError,
    transport: getSimplePrettyTerminal({
      runtime: 'node',
      viewMode: 'message-only',
      theme: moonlight,
    }),
  });
}
