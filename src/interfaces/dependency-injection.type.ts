import { Type } from '@nestjs/common';

export type DependencyInjectionType = string | symbol | Type<any>;
