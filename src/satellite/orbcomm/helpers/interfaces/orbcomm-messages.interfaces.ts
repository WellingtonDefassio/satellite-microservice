export interface SubmitResponse {
  ErrorID: number;
  Submission: Submission[];
}

export interface Submission {
  ForwardMessageID: number;
  DestinationID: string;
  ErrorID: number;
  UserMessageID: number;
}

export interface ForwardStatuses {
  ErrorID: number;
  Statuses: StatusesType[];
}

export interface StatusesType {
  ForwardMessageID: number;
  IsClosed: boolean;
  State: number;
  StateUTC: string;
  ReferenceNumber: number;
  Transport: string;
  RegionName: string;
}
export interface Submission {
  ForwardMessageID: number;
  DestinationID: string;
  ErrorID: number;
  UserMessageID: number;
}

export interface MessageBodyPost {
  access_id: string;
  password: string;
  messages: {
    DestinationID: string;
    UserMessageID: number;
    RawPayload: number[];
  }[];
}
export interface MessageBodyGetStatus {
  access_id: string;
  password: string;
  fwIDs: number[];
}
export interface BodyToGetMessage {
  access_id: any;
  password: string;
  include_raw_payload: boolean;
  start_utc: string;
}
export interface ReceiveDownloadData {
  ErrorID: number;
  NextStartUTC: string;
  Messages: ReceiveDownloadMessageData[];
}
export interface ReceiveDownloadMessageData {
  ID: number;
  MessageUTC: string;
  ReceiveUTC: string;
  SIN: number;
  MobileID: string;
  RawPayload: number[];
  Payload?: ReceivePayload;
  RegionName: string;
  OTAMessageSize: number;
  CustomerID: number;
  Transport: number;
  MobileOwnerID: number;
}

interface ReceivePayload {
  Name: string;
  SIN: number;
  MIN: number;
  Fields: { Name: string; Value: string }[];
}

export interface DownloadResponse {
  apiResponseData: ReceiveDownloadData;
  previousMessage: string;
}

export interface DeviceApi {
  ErrorID: number;
  Terminals: Terminals[];
}

export interface Terminals {
  PrimeID: string;
  Description: string;
  LastRegistrationUTC: string;
  RegionName: string;
  MTSN: string;
}

export enum OrbcommStatusMap {
  SUBMITTED = 0,
  RECEIVED = 1,
  ERROR = 2,
  DELIVERY_FAILED = 3,
  TIMEOUT = 4,
  CANCELLED = 5,
  WAITING = 6,
  INVALID = 7,
  TRANSMITTED = 8,
}
