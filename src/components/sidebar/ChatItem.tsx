import { getMessageContentDescription, getTimestampString } from "@/common/messageHelpers";
import type { IChatMessage, IChatPreview } from "@/models/chat";
import { MessageContentType, MessageDirectionType } from "@/models/chat.enums";
import Avatar from "../ui/Avatar";

interface IProps {
  chat: IChatPreview;
  chatMessages?: IChatMessage[];
  isActive: boolean;
  handleChatClick: (chatId: string) => void;
}

function ChatItem({ chat, chatMessages, isActive, handleChatClick }: IProps) {
  const lastMessage = chatMessages?.[0];

  const isTextMessage =
    lastMessage &&
    [MessageContentType.TEXT, MessageContentType.EXTENDED_TEXT].includes(lastMessage.typeMessage);

  const lastMessageTime: string | undefined = lastMessage
    ? getTimestampString(lastMessage.timestamp)
    : undefined;

  const unreadCount =
    chatMessages?.reduce((acc, { directionType, localRead }) => {
      if (directionType === MessageDirectionType.INCOMING && !localRead) {
        return acc + 1;
      }
      return acc;
    }, 0) ?? 0;

  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer gap-4 border-b border-gray-200 px-4 py-4 text-left hover:bg-blue-50 focus-visible:-outline-offset-2 ${isActive ? "bg-blue-50" : ""}`}
      onClick={() => handleChatClick(chat.chatId)}
    >
      <Avatar avatar={chat.avatar} name={chat.title} className="size-14 shrink-0" />

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate font-bold text-gray-600">{chat.title}</span>
          <span className="shrink-0 text-xs text-gray-400">{lastMessageTime}</span>
        </span>

        <span className="flex items-center justify-between gap-2">
          {lastMessage ? (
            isTextMessage ? (
              <span className="truncate text-sm text-gray-700">{lastMessage.textMessage}</span>
            ) : (
              <span className="truncate font-mono text-sm text-gray-400">
                {getMessageContentDescription(lastMessage)}
              </span>
            )
          ) : (
            <span className="truncate text-sm text-gray-400 italic">Нет сообщений</span>
          )}

          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

export default ChatItem;
