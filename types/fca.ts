interface EventAttachment {
  type?: string;
  url?: string;
}

interface EventMessageReply {
  attachments: EventAttachment[];
  body: string;
  isGroup: boolean;
  mentions: { [id: string]: string };
  messageID: string;
  senderID: string;
  threadID: string;
  isUnread: boolean;
}

export interface FCAEvent {
  type: string;
  body: string;
  senderID: string;
  messageID: string;
  attachments: EventAttachment[];
  threadID: string;
  messageReply: EventMessageReply[];
}
