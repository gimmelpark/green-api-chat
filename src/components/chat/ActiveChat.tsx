import type { IChatPreview } from "@/models/chat";
import { useChatStore } from "@/store/chatStore";
import { useShallow } from "zustand/shallow";
import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessages from "./ChatMessages";

interface IProps {
  chat: IChatPreview;
}

function ActiveChat({ chat }: IProps) {
  const { setActiveChatId } = useChatStore(
    useShallow((state) => ({
      setActiveChatId: state.setActiveChatId,
    })),
  );

  function handleBackClick() {
    setActiveChatId(null);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader handleBackClick={handleBackClick} chat={chat} />

      <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto bg-chat-bg">
        <div className="mt-4 flex flex-col xl:items-center">
          <div className="mx-8 flex-1 lg:mx-32 xl:mx-0 xl:w-200">
            <ChatMessages chatId={chat.chatId} />
          </div>

          <div className="sticky bottom-0 mx-8 lg:mx-32 xl:mx-0 xl:w-200">
            <ChatMessageInput key={chat.chatId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveChat;
