import {
  ConfigType,
  ContextName,
  HttpContextRequestProperty,
} from '../interfaces';
import { CONTEXT_CORRELATION_ID, HEADER_CORRELATION_ID } from '../constants';
import { correlationIdGenerator } from '../tools';

// TODO JDM add stackdrive and information needed for cloud events

const createHttpContextDefaults = (config: ConfigType) => {
  const { correlation_id } = config;
  return {
    [CONTEXT_CORRELATION_ID]: [
      correlation_id?.generator ??
        correlationIdGenerator(CONTEXT_CORRELATION_ID),
      `${HttpContextRequestProperty.HEADERS}.${
        correlation_id?.header ?? HEADER_CORRELATION_ID
      }`,
    ],
  };
};

// TODO JDM make it work
const createGqlContextDefaults = (config: ConfigType) => ({});

export const addContextDefaults = (config: ConfigType) => {
  const { type, build } = config;

  switch (type) {
    case ContextName.HTTP:
      return {
        type,
        build: { ...build, ...createHttpContextDefaults(config) },
      };
    case ContextName.GQL:
      return { type, build: { ...build, ...createGqlContextDefaults(config) } };
    default:
      return config;
  }
};
