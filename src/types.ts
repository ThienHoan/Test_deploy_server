import { IncomingMessage, ServerResponse } from "http";

export interface MyResponse extends ServerResponse {
  send: (data: any | unknown) => void;
  json: (data: unknown) => void;
  status: (code: number) => MyResponse;
}

export interface MyRequest extends IncomingMessage {
  query?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
}