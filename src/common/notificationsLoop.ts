import { deleteNotification, receiveNotification } from "@/api/greenApi";
import type { NotificationType } from "@/models/chat";
import { useAuthStore } from "@/store/authStore";
import {
  RECEIVE_NOTIFICATIONS_ABORT_TIMEOUT_SECONDS,
  RECEIVE_NOTIFICATIONS_RETRY_WAIT_MS,
} from "./constants";

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// цикл получения уведомлений
export async function notificationsLoop(
  signal: AbortSignal,
  notificationCallBack: (notification: NotificationType) => void,
) {
  const instanceData = useAuthStore.getState().instanceData;

  if (!instanceData) {
    console.error("No instance data");
    return;
  }

  while (!signal.aborted) {
    try {
      // сигнал остановится либо по внешнему сигналу, либо по таймауту
      const abortSignal = AbortSignal.any([
        signal,
        AbortSignal.timeout(RECEIVE_NOTIFICATIONS_ABORT_TIMEOUT_SECONDS * 1000),
      ]);

      const notificationData = await receiveNotification(instanceData, abortSignal);

      if (notificationData) {
        // обработка уведомления
        try {
          notificationCallBack(notificationData.body);
        } catch (e) {
          console.error(e);
        }

        await deleteNotification(instanceData, notificationData.receiptId);
      }
    } catch (e) {
      if (signal.aborted) {
        // завершаем цикл если он остановлен снаружи
        break;
      }

      // иначе пробуем продолжить после паузы
      console.error(e);
      await wait(RECEIVE_NOTIFICATIONS_RETRY_WAIT_MS);
    }
  }
}
