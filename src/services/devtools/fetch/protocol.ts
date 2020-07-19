import {Protocol} from 'devtools-protocol';

export type EnableRequest = Protocol.Fetch.EnableRequest;
export type GetResponseBodyResponse = Protocol.Fetch.GetResponseBodyResponse;
export type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;
export type ContinueRequestRequest = Protocol.Fetch.ContinueRequestRequest;
export type FulfillRequestRequest = Protocol.Fetch.FulfillRequestRequest;
export type FailRequestRequest = Protocol.Fetch.FailRequestRequest;
export type HeaderEntry = Protocol.Fetch.HeaderEntry;

export type ResponsePausedEvent = RequiredProps<RequestPausedEvent, 'responseStatusCode' | 'responseHeaders'>;
