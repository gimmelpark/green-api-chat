import type {
  IChatMessage,
  IIncomingMessageNotification,
  IOutgoingMessageNotification,
} from "@/models/chat";
import {
  MessageContentType,
  MessageDirectionType,
  NotificationWebhookType,
} from "@/models/chat.enums";

export function getReceivedMessage(
  notification: IIncomingMessageNotification | IOutgoingMessageNotification,
): IChatMessage {
  const textMessage =
    "textMessageData" in notification.messageData
      ? notification.messageData.textMessageData?.textMessage
      : "extendedTextMessageData" in notification.messageData
        ? notification.messageData.extendedTextMessageData?.text
        : undefined;

  return {
    idMessage: notification.idMessage,
    chatId: notification.senderData.chatId,
    directionType:
      notification.typeWebhook === NotificationWebhookType.INCOMING_RECEIVED
        ? MessageDirectionType.INCOMING
        : MessageDirectionType.OUTGOING,
    typeMessage: notification.messageData.typeMessage,
    timestamp: notification.timestamp,
    textMessage,
    localRead:
      notification.typeWebhook === NotificationWebhookType.INCOMING_RECEIVED ? false : undefined,
  };
}

export function getMessageContentDescription(message: IChatMessage): string | null {
  switch (message.typeMessage) {
    case MessageContentType.TEXT:
    case MessageContentType.EXTENDED_TEXT: {
      return null;
    }
    case MessageContentType.IMAGE: {
      return "Фотография";
    }
    case MessageContentType.VIDEO: {
      return "Видео";
    }
    case MessageContentType.DOCUMENT: {
      return "Документ";
    }
    case MessageContentType.AUDIO: {
      return "Голосовое сообщение";
    }
    case MessageContentType.POLL: {
      return "Опрос";
    }
    case MessageContentType.LOCATION: {
      return "Локация";
    }
    case MessageContentType.CONTACT: {
      return "Контакт";
    }
    case MessageContentType.REACTION: {
      return "Реакция";
    }
    case MessageContentType.STICKER: {
      return "Стикер";
    }
    default: {
      return "Сообщение";
    }
  }
}

export function getTimestampString(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const pad = (value: number) => value.toString().padStart(2, "0");

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
}
