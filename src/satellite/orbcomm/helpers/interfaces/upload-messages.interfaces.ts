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
  NextStartUTC: string;
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
export interface PostParams {
  DestinationID: string;
  UserMessageID: number;
  RawPayload: number[];
}
export interface PostMessagesParams {
  access_id: number;
  password: string;
  messages?: PostParams[];
}
