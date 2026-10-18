import type { IChatPreview } from "@/models/chat";
import { useChatStore } from "@/store/chatStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import AddChatForm from "./AddChatForm";
import ChatsList from "./ChatsList";
import SidebarHeader from "./SidebarHeader";

function Sidebar() {
  const [showAddChatForm, setShowAddChatForm] = useState(false);

  const { chats, getChatsFromStorage, addChat } = useChatStore(
    useShallow((state) => ({
      chats: state.chats,
      getChatsFromStorage: state.getChatsFromStorage,
      addChat: state.addChat,
    })),
  );

  useEffect(() => {
    getChatsFromStorage();
  }, [getChatsFromStorage]);

  function handleAddChat(chat: IChatPreview) {
    addChat(chat);
    setShowAddChatForm(false);
  }

  return (
    <div className="flex h-full flex-col border-r border-gray-200">
      <SidebarHeader
        showAddButton={!showAddChatForm && !!chats.length}
        handleAddClick={() => setShowAddChatForm(true)}
      />

      {showAddChatForm ? (
        <AddChatForm
          handleCancelClick={() => setShowAddChatForm(false)}
          handleAddClick={handleAddChat}
        />
      ) : (
        <ChatsList handleAddChatClick={() => setShowAddChatForm(true)} />
      )}
    </div>
  );
}

export default Sidebar;
