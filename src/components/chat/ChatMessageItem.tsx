import { getMessageContentDescription, getTimestampString } from "@/common/messageHelpers";
import type { IChatMessage } from "@/models/chat";
import {
  MessageContentType,
  MessageDirectionType,
  OutgoingMessageStatusType,
} from "@/models/chat.enums";
import { Check, CheckCheck, CircleX, Clock } from "lucide-react";

interface IProps {
  message: IChatMessage;
}

function ChatMessageItem({ message }: IProps) {
  const isTextMessage = [MessageContentType.TEXT, MessageContentType.EXTENDED_TEXT].includes(
    message.typeMessage,
  );

  const timestampString = getTimestampString(message.timestamp);

  const isOutgoingMessage = message.directionType === MessageDirectionType.OUTGOING;

  if (!isTextMessage) {
    return (
      <div className="flex justify-between rounded-lg bg-white py-0 pr-1 pl-3">
        <div className="font-mono text-gray-600">{getMessageContentDescription(message)}</div>
        <div className="ml-2 self-end font-mono text-xs text-gray-400">{timestampString}</div>
      </div>
    );
  }

  function getMessageStatusIcon() {
    switch (message.statusMessage) {
      case undefined: {
        return <Clock className="size-3" />;
      }

      case OutgoingMessageStatusType.DELIVERED: {
        return <Check className="size-3" />;
      }

      case OutgoingMessageStatusType.READ: {
        return <CheckCheck className="size-3" />;
      }

      case OutgoingMessageStatusType.FAILED:
      case OutgoingMessageStatusType.NO_ACCOUNT: {
        return <CircleX className="size-3 text-red-900" />;
      }

      default: {
        return null;
      }
    }
  }

  return (
    <div
      className={`max-w-70 min-w-18 rounded-lg pt-2 pr-1 pl-3 xl:max-w-110 ${isOutgoingMessage ? "bg-blue-100" : "bg-white"}`}
    >
      <div className="mr-2 wrap-anywhere whitespace-pre-wrap">{message.textMessage}</div>

      <div className="flex flex-row-reverse justify-between">
        <div className="ml-2 flex gap-1 self-end font-mono text-xs text-gray-400">
          {timestampString} {isOutgoingMessage && getMessageStatusIcon()}
        </div>
      </div>
    </div>
  );
}

export default ChatMessageItem;
