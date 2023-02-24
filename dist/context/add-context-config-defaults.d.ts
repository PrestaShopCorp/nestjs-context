import { ContextConfigType } from '../interfaces';
export declare const addContextConfigDefaults: (config: Partial<ContextConfigType> & {
    type: ContextConfigType['type'];
}) => ContextConfigType;
