import { Context } from '../../context';

const contextInstanceMock = new Context(null, null, null);
contextInstanceMock.get = jest.fn((test: any) => test);
contextInstanceMock.getAll = jest.fn(() => {});

export { contextInstanceMock };
