import { DynamicModule } from '@nestjs/common';
import { ContextConfigType } from './interfaces';
export declare const convertToContextModule: (convert: Partial<DynamicModule>, config: ContextConfigType) => DynamicModule;
