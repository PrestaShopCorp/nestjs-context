import { ConfigType, ExecutionContext } from '../interfaces';

// TODO JDM add stackdrive and information needed for cloud events
const httpBuild = {
  correlation_id: ['headers.x-correlation-id'],
};

// TODO JDM make it work
const cqlBuild = {
  correlation_id: ['req.headers.x-correlation-id'],
};

export const addContextDefaults = (config: ConfigType) => {
  const { type, build } = config;

  switch (type) {
    case ExecutionContext.HTTP:
      return { type, build: { ...build, ...httpBuild } };
    case ExecutionContext.GQL:
      return { type, build: { ...build, ...cqlBuild } };
    default:
      return config;
  }
};
