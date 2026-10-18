import { getReceivedMessage } from "@/common/messageHelpers";
import { NotificationWebhookType } from "@/models/chat.enums";
import { useChatStore } from "@/store/chatStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import Chat from "../chat/Chat";
import Sidebar from "../sidebar/Sidebar";
import Header from "./Header";

function AppLayout() {
  const { startNotificationsLoop, stopNotificationsLoop, subscribe, unsubscribe } =
    useNotificationStore(
      useShallow((state) => ({
        startNotificationsLoop: state.startNotificationsLoop,
        stopNotificationsLoop: state.stopNotificationsLoop,
        subscribe: state.subscribe,
        unsubscribe: state.unsubscribe,
      })),
    );

  const { activeChatId, handleReceivedMessage, updateMessageStatus } = useChatStore(
    useShallow((state) => ({
      activeChatId: state.activeChatId,
      handleReceivedMessage: state.handleReceivedMessage,
      updateMessageStatus: state.updateMessageStatus,
    })),
  );

  useEffect(() => {
    // начинаем получать уведомления
    startNotificationsLoop();

    // подписываемся на уведомления о сообщениях
    const receiveSId = subscribe(
      [
        NotificationWebhookType.INCOMING_RECEIVED,
        NotificationWebhookType.OUTGOING_API_RECEIVED,
        NotificationWebhookType.OUTGOING_RECEIVED,
      ],
      (notification) => {
        handleReceivedMessage(getReceivedMessage(notification));
      },
    );

    // подписываемся на уведомления об изменении статуса сообщений
    const statusSId = subscribe([NotificationWebhookType.OUTGOING_STATUS], (notification) => {
      updateMessageStatus(notification.chatId, notification.idMessage, notification.status);
    });

    return () => {
      stopNotificationsLoop();
      unsubscribe(receiveSId);
      unsubscribe(statusSId);
    };
  }, [
    startNotificationsLoop,
    stopNotificationsLoop,
    subscribe,
    unsubscribe,
    handleReceivedMessage,
    updateMessageStatus,
  ]);

  return (
    <div className="fixed inset-x-0 top-(--app-offset-top) flex h-(--app-height) flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        <div className={`${activeChatId ? "hidden md:block" : ""} w-full shrink-0 md:w-80`}>
          <Sidebar />
        </div>

        <div className={`${!activeChatId ? "hidden md:block" : ""} min-w-0 flex-1`}>
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
