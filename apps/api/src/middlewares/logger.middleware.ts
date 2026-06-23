import { serializeError } from 'serialize-error';
import { LogLayer } from 'loglayer';
import {
  getSimplePrettyTerminal,
  moonlight,
} from '@loglayer/transport-simple-pretty-terminal';

export function logger() {
  return new LogLayer({
    errorSerializer: serializeError,
    transport: getSimplePrettyTerminal({
      runtime: 'node',
      viewMode: 'message-only',
      theme: moonlight,
    }),
  });
}
