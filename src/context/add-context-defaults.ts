import { hostname, platform } from 'os';
import { basename, extname } from 'path';
import { Request } from 'express';
import {
  ConfigType,
  ContextName,
  HttpContextRequestProperty as HttpProp,
} from '../interfaces';
import {
  CONTEXT_BIN,
  CONTEXT_CONTENT_TYPE,
  CONTEXT_CORRELATION_ID,
  CONTEXT_HOSTNAME,
  CONTEXT_PLATFORM,
  CONTEXT_PATH,
  CONTEXT_PROTOCOL,
  HEADER_CONTENT_TYPE,
  HEADER_CORRELATION_ID,
} from '../constants';
import { correlationIdGenerator } from '../tools';

// TODO JDM add stackdrive and information needed for cloud events

const createHttpContextDefaults = (config: ConfigType) => {
  const { correlation_id } = config;
  return {
    [CONTEXT_CORRELATION_ID]: [
      correlation_id?.generator ??
        correlationIdGenerator(CONTEXT_CORRELATION_ID),
      `req.${HttpProp.HEADERS}.${
        correlation_id?.header ?? HEADER_CORRELATION_ID
      }`,
    ],
    [CONTEXT_PLATFORM]: [platform()],
    [CONTEXT_HOSTNAME]: [hostname(), 'req.hostname'],
    [CONTEXT_BIN]: [
      process.argv?.[1]
        ? basename(process.argv[1], extname(process.argv[1]))
        : `${hostname()}_${process.argv?.[0] || 'unknown'}`,
    ],
    [CONTEXT_PATH]: [
      (req: Request) => (req ? req.baseUrl + req.path : 'unknown'),
    ],
    [CONTEXT_PROTOCOL]: ['req.protocol'],
    [CONTEXT_CONTENT_TYPE]: [`req.${HttpProp.HEADERS}.${HEADER_CONTENT_TYPE}`],
  };
};

// TODO JDM make it work
const createGqlContextDefaults = (config: ConfigType) => ({});

export const addContextDefaults = (config: ConfigType) => {
  const { type, build } = config;

  switch (type) {
    case ContextName.HTTP:
      return {
        ...config,
        build: { ...build, ...createHttpContextDefaults(config) },
      };
    case ContextName.GQL:
      return {
        ...config,
        build: { ...build, ...createGqlContextDefaults(config) },
      };
    default:
      return config;
  }
};
