import { ContextName, HttpContextRequestProperty } from '../interfaces';
import { CONTEXT_CORRELATION_ID, HEADER_CORRELATION_ID } from '../constants';
import { addContextDefaults } from './add-context-defaults';
import { correlationIdGenerator } from '../tools';

const httpDefaults = {
  [CONTEXT_CORRELATION_ID]: [
    correlationIdGenerator,
    `${HttpContextRequestProperty.HEADERS}.${HEADER_CORRELATION_ID}`,
  ],
};
describe.each([
  [ContextName.HTTP, httpDefaults],
  [ContextName.GQL, {}],
])('addContextDefaults (%s)', (contextName: ContextName, defaults: any) => {
  Object.keys(defaults).forEach((key) => {
    it(`adds ${key}`, () => {
      expect(
        addContextDefaults({ type: contextName, build: {} }).build,
      ).toStrictEqual(
        expect.objectContaining({
          [key]: expect.arrayContaining(defaults[key]),
        }),
      );
    });
  });
});
