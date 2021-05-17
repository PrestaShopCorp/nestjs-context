import { hostname, platform } from 'os';
import { basename, extname } from 'path';
import { Request } from 'express';
import { merge } from 'lodash';
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

const createHttpContextDefaults = (config: Partial<ConfigType>) => {
  const { generator = null, header = HEADER_CORRELATION_ID } =
    config?.correlation_id ?? {};
  const build = {
    [CONTEXT_CORRELATION_ID]: [
      generator === true ? correlationIdGenerator : generator,
      `req.${HttpProp.HEADERS}.${header}`,
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
  return {
    build,
    cache: true,
  };
};

export const addContextDefaults = (
  config: Partial<ConfigType> & { type: ConfigType['type'] },
) => {
  const { type } = config;

  switch (type) {
    case ContextName.HTTP:
      return merge(config, createHttpContextDefaults(config));
    default:
      return config;
  }
};
