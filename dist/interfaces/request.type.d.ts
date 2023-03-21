import { Request } from 'express';
import { HEADER_REQUEST_ID } from '../constants';
export type RequestType = Request | ({
    [HEADER_REQUEST_ID]: string;
} & Record<string, any>);
