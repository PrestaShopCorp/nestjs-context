import { hostname, platform } from 'os';
import { basename, extname } from 'path';
import { Request } from 'express';
import { merge } from 'lodash';
import {
  ContextConfigType,
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
  CONTEXT_REQUEST_ID,
  HEADER_REQUEST_ID,
} from '../constants';

// TODO JDM add stackdrive and information needed for cloud events

const createHttpContextDefaults = (config: Partial<ContextConfigType>) => {
  const { header = HEADER_CORRELATION_ID } = config?.correlation_id ?? {};
  const build = {
    // TODO fallback must disappear for this context when we create other contexts !
    [CONTEXT_REQUEST_ID]: [
      `req.${HEADER_REQUEST_ID}`,
      `req.${HttpProp.HEADERS}.${HEADER_REQUEST_ID}`,
    ],
    [CONTEXT_CORRELATION_ID]: [`req.${HttpProp.HEADERS}.${header}`],
    [CONTEXT_PLATFORM]: [platform()],
    [CONTEXT_HOSTNAME]: [hostname(), 'req.hostname'],
    [CONTEXT_BIN]: [
      process.argv?.[1]
        ? basename(process.argv[1], extname(process.argv[1]))
        : `${hostname()}_${process.argv?.[0] || null}`,
    ],
    [CONTEXT_PATH]: [
      (req: Request) =>
        req?.baseUrl ? `${req.baseUrl}${req.path || '/'}` : '/',
    ],
    [CONTEXT_PROTOCOL]: ['req.protocol'],
    [CONTEXT_CONTENT_TYPE]: [`req.${HttpProp.HEADERS}.${HEADER_CONTENT_TYPE}`],
  };
  return {
    build,
    cached: false,
  } as Partial<ContextConfigType>;
};

export const addContextConfigDefaults: (
  config: Partial<ContextConfigType> & { type: ContextConfigType['type'] },
) => ContextConfigType = (config) => {
  const { type } = config;

  switch (type) {
    case ContextName.HTTP:
      return merge(createHttpContextDefaults(config), config);
    default:
      return config;
  }
};
