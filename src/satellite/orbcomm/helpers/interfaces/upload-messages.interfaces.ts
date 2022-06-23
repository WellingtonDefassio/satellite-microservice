interface SubmitResponse {
  ErrorID: number;
  Submission: Submission[];
}

interface Submission {
  ForwardMessageID: number;
  DestinationID: string;
  ErrorID: number;
  UserMessageID: number;
}
