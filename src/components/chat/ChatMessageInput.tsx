import { useChatStore } from "@/store/chatStore";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useShallow } from "zustand/shallow";

function ChatMessageInput() {
  const [messageText, setMessageText] = useState("");

  const inputRef = useRef<null | HTMLInputElement>(null);

  const { isPendingSendMessage, sendTextMessage } = useChatStore(
    useShallow((state) => ({
      isPendingSendMessage: state.isPendingSendMessage,
      sendTextMessage: state.sendTextMessage,
    })),
  );

  useEffect(() => {
    if (!isPendingSendMessage) inputRef.current?.focus();
  }, [isPendingSendMessage]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    try {
      event.preventDefault();

      if (!messageText.trim() || isPendingSendMessage) return;

      await sendTextMessage(messageText.trim());

      setMessageText("");
      inputRef.current?.focus();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <form
      className="mb-4 flex h-12 items-center justify-between gap-4 rounded-xl bg-white pr-2 pl-4"
      onSubmit={handleSubmit}
    >
      <input
        className="flex-1 outline-none"
        placeholder="Сообщение"
        value={messageText}
        disabled={isPendingSendMessage}
        ref={inputRef}
        onChange={(e) => setMessageText(e.target.value)}
      />

      <button
        type="submit"
        aria-label="Отправить"
        title="Отправить"
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover"
        disabled={isPendingSendMessage}
      >
        <ArrowUp size={20} />
      </button>
    </form>
  );
}

export default ChatMessageInput;
