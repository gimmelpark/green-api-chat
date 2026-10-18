import type {
  MessageContentType,
  MessageDirectionType,
  NotificationWebhookType,
  OutgoingMessageStatusType,
} from "@/models/chat.enums";

export interface IChatPreview {
  chatId: string;
  title: string;
  avatar?: string;
}

export interface IChatMessage {
  idMessage: string;
  chatId: string;
  directionType: MessageDirectionType;
  statusMessage?: OutgoingMessageStatusType;
  typeMessage: MessageContentType;
  timestamp: number;
  textMessage?: string;
  localRead?: boolean;
}

export interface ICheckAccountResponse {
  exist: boolean;
  chatId: string;
}

export interface IGetContactInfoResponse {
  avatar?: string;
  name: string;
}

export interface IMessageSenderData {
  chatId: string;
}

export interface IMessageData {
  typeMessage: MessageContentType;
  textMessageData?: {
    textMessage: string;
  };
}

export interface IExtendedMessageData {
  typeMessage: MessageContentType;
  extendedTextMessageData?: {
    text: string;
  };
}

export interface IIncomingMessageNotification {
  typeWebhook: NotificationWebhookType.INCOMING_RECEIVED;
  timestamp: number;
  idMessage: string;
  senderData: IMessageSenderData;
  messageData: IMessageData | IExtendedMessageData;
}

export interface IOutgoingMessageNotification {
  typeWebhook:
    NotificationWebhookType.OUTGOING_RECEIVED | NotificationWebhookType.OUTGOING_API_RECEIVED;
  timestamp: number;
  idMessage: string;
  senderData: IMessageSenderData;
  messageData: IMessageData | IExtendedMessageData;
}

export interface IOutgoingMessageStatusNotification {
  typeWebhook: NotificationWebhookType.OUTGOING_STATUS;
  timestamp: number;
  idMessage: string;
  chatId: string;
  status: OutgoingMessageStatusType;
}

export type NotificationType =
  IIncomingMessageNotification | IOutgoingMessageNotification | IOutgoingMessageStatusNotification;

export type NotificationTypeByWebhookType<T extends NotificationWebhookType> = NotificationType & {
  typeWebhook: T;
};

export interface IReceivedNotification {
  receiptId: number;
  body: NotificationType;
}

export interface ISendMessageResponse {
  idMessage: string;
}
