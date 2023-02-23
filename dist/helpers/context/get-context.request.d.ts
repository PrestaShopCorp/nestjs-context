import { ExecutionContext } from '@nestjs/common';
import { ContextName } from '../../interfaces';
export declare const getContextRequest: (type: ContextName, ctx: ExecutionContext) => any;
