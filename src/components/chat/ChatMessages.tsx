import { MessageDirectionType } from "@/models/chat.enums";
import { useChatStore } from "@/store/chatStore";
import { useShallow } from "zustand/shallow";
import ChatMessageItem from "./ChatMessageItem";

interface IProps {
  chatId: string;
}

function ChatMessages({ chatId }: IProps) {
  const { sessionChatMessages } = useChatStore(
    useShallow((state) => ({
      sessionChatMessages: state.sessionChatMessages,
    })),
  );

  const messages = sessionChatMessages[chatId] ?? [];

  return (
    <div className="flex h-full flex-col-reverse items-center justify-start">
      {messages.length ? (
        messages.map((message) => (
          <div
            key={message.idMessage}
            className={`mb-4 ${message.directionType === MessageDirectionType.INCOMING ? "self-start" : "self-end"}`}
          >
            <ChatMessageItem message={message} />
          </div>
        ))
      ) : (
        <div className="mb-1 text-gray-600 italic">Сообщений пока нет</div>
      )}
    </div>
  );
}

export default ChatMessages;
