import { Request } from 'express';
import { HEADER_REQUEST_ID } from '../constants';
export declare type RequestType = Request | ({
    [HEADER_REQUEST_ID]: string;
} & Record<string, any>);
