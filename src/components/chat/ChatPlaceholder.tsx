interface IProps {
  text: string;
}

function ChatPlaceholder({ text }: IProps) {
  return (
    <div className="flex h-full items-center justify-center bg-chat-bg">
      <div className="rounded-sm px-2 py-1 text-gray-700 italic outline outline-gray-500">
        {text}
      </div>
    </div>
  );
}

export default ChatPlaceholder;
