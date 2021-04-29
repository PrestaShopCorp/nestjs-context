import { ContextName, HttpContextRequestProperty } from '../interfaces';
import {
  CONTEXT_BIN,
  CONTEXT_CONTENT_TYPE,
  CONTEXT_CORRELATION_ID,
  CONTEXT_HOSTNAME,
  CONTEXT_PATH,
  CONTEXT_PLATFORM,
  CONTEXT_PROTOCOL,
  CONTEXT_RUNTIME,
} from '../constants';
import { addContextDefaults } from './add-context-defaults';

const httpDefaults = [
  CONTEXT_CORRELATION_ID,
  CONTEXT_PLATFORM,
  CONTEXT_HOSTNAME,
  CONTEXT_RUNTIME,
  CONTEXT_BIN,
  CONTEXT_PATH,
  CONTEXT_PROTOCOL,
  CONTEXT_CONTENT_TYPE,
];
describe.each([
  [ContextName.HTTP, httpDefaults],
  [ContextName.GQL, []],
])(
  'addContextDefaults (%s)',
  (contextName: ContextName, defaults: string[]) => {
    it(`adds: ${defaults.join(', ')}`, () => {
      expect(
        Object.keys(addContextDefaults({ type: contextName, build: {} }).build),
      ).toStrictEqual(defaults);
    });
  },
);
