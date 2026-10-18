import { useChatStore } from "@/store/chatStore";
import { useShallow } from "zustand/shallow";
import ActiveChat from "./ActiveChat";
import ChatPlaceholder from "./ChatPlaceholder";

function Chat() {
  const { activeChatId, chats } = useChatStore(
    useShallow((state) => ({ activeChatId: state.activeChatId, chats: state.chats })),
  );

  if (!activeChatId) return <ChatPlaceholder text="Выберите чат" />;

  const activeChat = chats.find(({ chatId }) => chatId === activeChatId);

  if (!activeChat) return <ChatPlaceholder text="Не удалось найти чат" />;

  return (
    <div className="flex h-full flex-col">
      <ActiveChat chat={activeChat} />
    </div>
  );
}

export default Chat;
