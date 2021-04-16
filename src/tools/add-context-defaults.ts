import {
  ConfigType,
  ContextName,
  HttpContextRequestProperty,
} from '../interfaces';

// TODO JDM add stackdrive and information needed for cloud events
const httpBuild = {
  correlation_id: [`${HttpContextRequestProperty.HEADERS}.x-correlation-id`],
};

// TODO JDM make it work
const cqlBuild = {};

export const addContextDefaults = (config: ConfigType) => {
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
