import { Request } from 'express';
import { HEADER_REQUEST_ID } from '../constants';

/// @todo create ContextSource class wrapping all the context request cases
export type RequestType =
  | Request
  | ({
      [HEADER_REQUEST_ID]: string;
    } & Record<string, any>);
