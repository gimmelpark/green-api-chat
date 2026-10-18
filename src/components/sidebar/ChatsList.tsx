import Button from "@/components/ui/Button";
import { useChatStore } from "@/store/chatStore";
import { useShallow } from "zustand/shallow";
import ChatItem from "./ChatItem";

interface IProps {
  handleAddChatClick: () => void;
}

function ChatsList({ handleAddChatClick }: IProps) {
  const { chats, sessionChatMessages, activeChatId, setActiveChatId } = useChatStore(
    useShallow((state) => ({
      chats: state.chats,
      sessionChatMessages: state.sessionChatMessages,
      activeChatId: state.activeChatId,
      setActiveChatId: state.setActiveChatId,
    })),
  );

  if (!chats.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-gray-500">Здесь пока ничего нет</p>
        <Button onClick={handleAddChatClick}>Добавить чат</Button>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {[...chats].reverse().map((chat) => (
        <ChatItem
          key={chat.chatId}
          chat={chat}
          chatMessages={sessionChatMessages[chat.chatId]}
          isActive={activeChatId === chat.chatId}
          handleChatClick={setActiveChatId}
        />
      ))}
    </div>
  );
}

export default ChatsList;
