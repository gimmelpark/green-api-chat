export enum MessageDirectionType {
  OUTGOING = "outgoing",
  INCOMING = "incoming",
}

export enum OutgoingMessageStatusType {
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
  NO_ACCOUNT = "noAccount",
}

export enum MessageContentType {
  TEXT = "textMessage",
  EXTENDED_TEXT = "extendedTextMessage",
  IMAGE = "imageMessage",
  VIDEO = "videoMessage",
  DOCUMENT = "documentMessage",
  AUDIO = "audioMessage",
  POLL = "pollMessage",
  LOCATION = "locationMessage",
  CONTACT = "contactMessage",
  REACTION = "reactionMessage",
  STICKER = "stickerMessage",
}

export enum NotificationWebhookType {
  INCOMING_RECEIVED = "incomingMessageReceived",
  OUTGOING_RECEIVED = "outgoingMessageReceived",
  OUTGOING_API_RECEIVED = "outgoingAPIMessageReceived",
  OUTGOING_STATUS = "outgoingMessageStatus",
}
