import type { IChatPreview } from "@/models/chat";
import { ChevronLeft } from "lucide-react";
import Avatar from "../ui/Avatar";

interface IProps {
  chat: IChatPreview;
  handleBackClick: () => void;
}

function ChatHeader({ chat, handleBackClick }: IProps) {
  return (
    <div className="flex h-12 items-center border-b border-gray-200 px-4 py-2">
      <button
        type="button"
        aria-label="Назад"
        title="Назад"
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg outline transition-colors hover:bg-gray-100"
        onClick={handleBackClick}
      >
        <ChevronLeft size={20} />
      </button>

      <Avatar avatar={chat.avatar} name={chat.title} className="ml-3" />

      <div className="ml-3 truncate font-bold text-gray-800" title={chat.title}>
        {chat.title}
      </div>
    </div>
  );
}

export default ChatHeader;
