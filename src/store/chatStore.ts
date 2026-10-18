import { checkAccount, getContactInfo, sendTextMessage } from "@/api/greenApi";
import { CHATS_STORAGE_KEY } from "@/common/constants";
import type { IChatMessage, IChatPreview } from "@/models/chat";
import {
  MessageContentType,
  MessageDirectionType,
  OutgoingMessageStatusType,
} from "@/models/chat.enums";
import { create } from "zustand";
import { useAuthStore } from "./authStore";

type ChatState = {
  chats: IChatPreview[];
  isPendingAccountSearch: boolean;
  accountSearchError: string | null;
  sessionChatMessages: Record<string, IChatMessage[]>;
  activeChatId: string | null;
  isPendingSendMessage: boolean;
};

type ChatActions = {
  getChatsFromStorage: () => void;
  accountSearch: (data: { phone?: number; name?: string }) => Promise<IChatPreview | undefined>;
  resetAccountSearchError: () => void;
  addChat: (chat: IChatPreview) => void;
  addMessageToChat: (messageData: IChatMessage, readNewMessages?: boolean) => void;
  handleReceivedMessage: (messageData: IChatMessage) => void;
  setActiveChatId: (chatId: string | null) => void;
  sendTextMessage: (messageText: string) => Promise<void>;
  updateMessageStatus: (
    chatId: string,
    idMessage: string,
    status: OutgoingMessageStatusType,
  ) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState & ChatActions>()((set, get) => ({
  chats: [],
  sessionChatMessages: {},

  isPendingAccountSearch: false,
  accountSearchError: null,

  activeChatId: null,

  isPendingSendMessage: false,

  // получить чаты из ls
  getChatsFromStorage: () => {
    const chatsJSON = localStorage.getItem(CHATS_STORAGE_KEY);

    if (!chatsJSON) return;

    try {
      const chats: unknown = JSON.parse(chatsJSON);

      if (Array.isArray(chats)) {
        set({ chats });
      }
    } catch {
      localStorage.removeItem(CHATS_STORAGE_KEY);
    }
  },

  accountSearch: async (searchData) => {
    set({ isPendingAccountSearch: true });

    try {
      const { instanceData } = useAuthStore.getState();

      if (!instanceData) throw new Error("No instance data");

      const data = await checkAccount(instanceData, searchData);

      // ничего не найдено или это группа
      if (!data.exist || +data.chatId < 0) {
        throw new Error();
      }

      // проверяем есть ли уже такой чат
      if (get().chats.some(({ chatId }) => chatId === data.chatId)) {
        set({ accountSearchError: "Чат с этим пользователем уже существует" });
        return;
      }

      // получаем дополнительную информацию о чате
      const chatInfo = await getContactInfo(instanceData, data.chatId);

      return {
        chatId: data.chatId,
        title: chatInfo.name || `Chat ${data.chatId}`,
        avatar: chatInfo.avatar,
      };
    } catch {
      set({ accountSearchError: "Не удалось найти пользователя" });
    } finally {
      set({ isPendingAccountSearch: false });
    }
  },

  resetAccountSearchError: () => {
    set({ accountSearchError: null });
  },

  addChat: (chat) => {
    const updatedChats = [...get().chats, chat];

    set({
      chats: updatedChats,
      activeChatId: chat.chatId,
    });

    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
  },

  // добавить новое сообщение в чат
  addMessageToChat: (messageData, readNewMessages = false) => {
    const updatedMessage = { ...messageData };

    // читаем входящее сообщение если оно в текущем чате
    if (
      readNewMessages &&
      messageData.directionType === MessageDirectionType.INCOMING &&
      get().activeChatId === messageData.chatId
    ) {
      updatedMessage.localRead = true;
    }

    // удаляем сообщение с таким же idMessage если есть
    const chatMessages = (get().sessionChatMessages[messageData.chatId] ?? []).filter(
      ({ idMessage }) => idMessage !== messageData.idMessage,
    );

    // сортируем по времени
    const updatedChatMessages = [updatedMessage, ...chatMessages].sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    set({
      sessionChatMessages: {
        ...get().sessionChatMessages,
        [messageData.chatId]: updatedChatMessages,
      },
    });
  },

  // обработка сообщений
  handleReceivedMessage: (messageData) => {
    if (get().chats.some(({ chatId }) => chatId === messageData.chatId)) {
      get().addMessageToChat(messageData, true);
    }
  },

  // выбор чата
  setActiveChatId: (chatId) => {
    set({
      activeChatId: chatId,
    });

    // читаем все новые сообщения
    if (chatId) {
      const updatedChatMessages =
        get().sessionChatMessages[chatId]?.map((message) => ({
          ...message,
          localRead: true,
        })) ?? [];

      set({
        sessionChatMessages: {
          ...get().sessionChatMessages,
          [chatId]: updatedChatMessages,
        },
      });
    }
  },

  // отправить сообщение в активный чат
  sendTextMessage: async (messageText) => {
    try {
      set({
        isPendingSendMessage: true,
      });

      const { instanceData } = useAuthStore.getState();

      if (!instanceData) throw new Error("No instance data");

      const activeChatId = get().activeChatId;

      if (!activeChatId) throw new Error("No active chat");

      const { idMessage } = await sendTextMessage(instanceData, activeChatId, messageText);

      // локально сохраняем новое сообщение до получения уведомления
      const sentMessage: IChatMessage = {
        idMessage,
        chatId: activeChatId,
        directionType: MessageDirectionType.OUTGOING,
        textMessage: messageText,
        typeMessage: MessageContentType.TEXT,
        timestamp: Math.floor(new Date().getTime() / 1000),
      };

      get().addMessageToChat(sentMessage);
    } finally {
      set({
        isPendingSendMessage: false,
      });
    }
  },

  // обновить статус отправленного сообщения
  updateMessageStatus: (chatId, idMessage, status) => {
    const chatMessages = get().sessionChatMessages;

    const updatedMessages = (chatMessages[chatId] ?? []).map((message) => {
      if (message.idMessage !== idMessage) return message;

      return {
        ...message,
        statusMessage: status,
      };
    });

    set({
      sessionChatMessages: {
        ...chatMessages,
        [chatId]: updatedMessages,
      },
    });
  },

  reset: () => {
    set({
      chats: [],
      isPendingAccountSearch: false,
      accountSearchError: null,
      sessionChatMessages: {},
      activeChatId: null,
      isPendingSendMessage: false,
    });
  },
}));
