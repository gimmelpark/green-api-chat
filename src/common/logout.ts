import { AUTH_STORAGE_KEY, CHATS_STORAGE_KEY } from "@/common/constants";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useNotificationStore } from "@/store/notificationStore";

export function logout() {
  useAuthStore.getState().reset();
  useChatStore.getState().reset();
  useNotificationStore.getState().reset();

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(CHATS_STORAGE_KEY);
}
