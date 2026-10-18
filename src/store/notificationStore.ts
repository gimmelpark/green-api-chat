import { notificationsLoop } from "@/common/notificationsLoop";
import type { NotificationType, NotificationTypeByWebhookType } from "@/models/chat";
import type { NotificationWebhookType } from "@/models/chat.enums";
import { create } from "zustand";

type NotificationState = {
  activeAbortController: null | AbortController;
  notificationsSubscribers: {
    subscriptionId: number;
    handler: (notification: NotificationType) => void;
    notificationTypes: NotificationWebhookType[];
  }[];
  maxId: number;
};

type NotificationActions = {
  startNotificationsLoop: () => void;
  handleNotification: (notification: NotificationType) => void;
  stopNotificationsLoop: () => void;
  subscribe: <T extends NotificationWebhookType>(
    notificationTypes: T[],
    handler: (notification: NotificationTypeByWebhookType<T>) => void,
  ) => number;
  unsubscribe: (subscriptionId: number) => void;
  reset: () => void;
};

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  (set, get) => ({
    activeAbortController: null,
    notificationsSubscribers: [],
    maxId: 0,

    startNotificationsLoop: () => {
      get().activeAbortController?.abort();

      const newAbortController = new AbortController();

      set({
        activeAbortController: newAbortController,
      });

      notificationsLoop(newAbortController.signal, (notification) => {
        get().handleNotification(notification);
      });
    },

    handleNotification: (notification) => {
      get()
        .notificationsSubscribers.filter(({ notificationTypes }) =>
          notificationTypes.includes(notification.typeWebhook),
        )
        .forEach(({ handler }) => handler(notification));
    },

    stopNotificationsLoop: () => {
      get().activeAbortController?.abort();
      set({ activeAbortController: null });
    },

    subscribe: (notificationTypes, handler) => {
      const subscriptionId = get().maxId + 1;

      set({
        notificationsSubscribers: [
          ...get().notificationsSubscribers,
          {
            subscriptionId,
            notificationTypes,
            handler: handler as (notification: NotificationType) => void,
          },
        ],
        maxId: subscriptionId,
      });

      return subscriptionId;
    },

    unsubscribe: (subscriptionId) => {
      set({
        notificationsSubscribers: get().notificationsSubscribers.filter(
          ({ subscriptionId: id }) => id !== subscriptionId,
        ),
      });
    },

    reset: () => {
      get().stopNotificationsLoop();
      set({
        notificationsSubscribers: [],
        maxId: 0,
      });
    },
  }),
);
