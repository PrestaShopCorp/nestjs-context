import { omit } from 'lodash';
import { ContextName, IContextPropertyProvider } from '../interfaces';
import {
  CONTEXT_BIN,
  CONTEXT_CONTENT_TYPE,
  CONTEXT_CORRELATION_ID,
  CONTEXT_HOSTNAME,
  CONTEXT_PATH,
  CONTEXT_PLATFORM,
  CONTEXT_PROTOCOL,
} from '../constants';
import { addContextDefaults } from './add-context-defaults';

const httpDefaults = [
  CONTEXT_CORRELATION_ID,
  CONTEXT_PLATFORM,
  CONTEXT_HOSTNAME,
  CONTEXT_BIN,
  CONTEXT_PATH,
  CONTEXT_PROTOCOL,
  CONTEXT_CONTENT_TYPE,
];

class Provider implements IContextPropertyProvider {
  get() {}
}

describe.each([
  [ContextName.HTTP, httpDefaults],
  [ContextName.GQL_HTTP, []],
])(
  'addContextDefaults (%s)',
  (contextName: ContextName, defaults: string[]) => {
    it(`adds build config for: ${defaults.join(', ')}`, () => {
      expect(
        Object.keys(addContextDefaults({ type: contextName, build: {} }).build),
      ).toStrictEqual(defaults);
    });
    it(`does not modify the rest of the config`, () => {
      const config = {
        type: contextName,
        providers: [Provider],
      };
      expect(
        omit(
          addContextDefaults({
            ...config,
            build: {},
          }),
          ['build'],
        ),
      ).toStrictEqual(config);
    });
  },
);
