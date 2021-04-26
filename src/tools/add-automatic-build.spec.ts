import { addAutomaticBuild } from './add-automatic-build';
import { ContextName } from '../interfaces';
import { getContextDefaultAutoBuildPath } from '../context';

describe('addAutomaticBuild', () => {
  class Target {
    property: string = '';
    property2: string = '';
  }
  it(`returns the same build that was given as parameter if auto was not enabled`, () => {
    expect(
      addAutomaticBuild({}, { type: ContextName.HTTP, target: {} }),
    ).toStrictEqual({});
  });
  it(`adds context-property-build callback that uses the default context path to look for the property, if auto.path was not set`, () => {
    const received = addAutomaticBuild(
      {},
      { type: ContextName.HTTP, target: Target, auto: { enabled: true } },
    );
    expect(
      (received.property[0] as Function)({
        [getContextDefaultAutoBuildPath(ContextName.HTTP)]: {
          property: 'test',
        },
      }),
    ).toBe('test');
  });
  it(`adds context property build callback that uses the given path to look for the property`, () => {
    const path = 'test.my';
    const received = addAutomaticBuild(
      {},
      { type: ContextName.HTTP, target: Target, auto: { enabled: true, path } },
    );
    expect(
      (received.property[0] as Function)({
        test: {
          my: {
            property: 'test',
          },
        },
      }),
    ).toBe('test');
  });
  it(`adds fallback for already declared build properties`, () => {
    const path = 'test';
    const received = addAutomaticBuild(
      { property: ['customValue'] },
      { type: ContextName.HTTP, target: Target, auto: { enabled: true, path } },
    );
    expect(
      (received.property[0] as Function)({
        test: {
          property: 'test',
        },
      }),
    ).toBe('test');
    expect(received.property[1]).toBe('customValue');
  });
  it(`does not add fallback for block-listed build properties`, () => {
    const path = 'test';
    const received = addAutomaticBuild(
      { property: ['customValue'] },
      {
        type: ContextName.HTTP,
        target: Target,
        auto: { enabled: true, path, blocklist: ['property'] },
      },
    );
    expect(received.property[0]).toBe('customValue');
    expect(received.property[1]).toBe(undefined);
  });
});
