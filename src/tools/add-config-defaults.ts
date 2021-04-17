import {
  ConfigType,
  ContextName,
  HttpContextRequestProperty,
} from '../interfaces';
import { CONTEXT_CORRELATION_ID } from '../constants';

// TODO JDM add stackdrive and information needed for cloud events
const httpBuild = {
  [CONTEXT_CORRELATION_ID]: [
    `${HttpContextRequestProperty.HEADERS}.x-correlation-id`,
  ],
};

// TODO JDM make it work
const cqlBuild = {};

export const addConfigDefaults = (config: ConfigType) => {
  const { type, build } = config;

  switch (type) {
    case ContextName.HTTP:
      return { type, build: { ...build, ...httpBuild } };
    case ContextName.GQL:
      return { type, build: { ...build, ...cqlBuild } };
    default:
      return config;
  }
};
