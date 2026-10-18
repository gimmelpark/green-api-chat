import { getAccountSettings, getInstanceSettings } from "@/api/greenApi";
import { AUTH_STORAGE_KEY } from "@/common/constants";
import type { IAccountSettings, IInstanceData } from "@/models/auth";
import { InstanceStateType } from "@/models/auth.enums";
import { create } from "zustand";

type AuthState = {
  isAuthorized: boolean;
  isPendingAuthData: boolean;
  authError: string | null;
  instanceData: IInstanceData | null;
  userName: string | null;
  userAvatar: string | null;
};

type AuthActions = {
  checkInstance: (instanceData: IInstanceData) => Promise<IAccountSettings>;
  login: (instanceData: IInstanceData) => Promise<void>;
  resetAuthError: () => void;
  initialAuthCheck: () => Promise<void>;
  reset: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  isAuthorized: false,
  isPendingAuthData: false,
  authError: null,

  instanceData: null,

  userName: null,
  userAvatar: null,

  resetAuthError: () => set({ authError: null }),

  checkInstance: async (instanceData: IInstanceData) => {
    // проверяем авторизацию
    const accountData = await getAccountSettings(instanceData);
    if (accountData.stateInstance !== InstanceStateType.AUTHORIZED) {
      set({ authError: "Инстанс не авторизован" });
      throw new Error();
    }

    // проверяем тип инстанса
    const instanceSettings = await getInstanceSettings(instanceData);
    if (instanceSettings.typeInstance !== "telegram") {
      set({ authError: "Версия инстанса не 'telegram'" });
      throw new Error();
    }

    return accountData;
  },

  login: async (instanceData) => {
    set({ isPendingAuthData: true, authError: null });

    try {
      const data = await get().checkInstance(instanceData);

      set({
        authError: null,
        isAuthorized: true,
        instanceData,
        userName: data.username,
        userAvatar: data.avatar,
      });

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(instanceData));
    } catch {
      if (!get().authError) {
        set({ authError: "Не удалось войти. Проверьте apiUrl, idInstance и apiTokenInstance" });
      }
    } finally {
      set({ isPendingAuthData: false });
    }
  },

  reset: () => {
    set({
      isAuthorized: false,
      isPendingAuthData: false,
      authError: null,
      instanceData: null,
      userName: null,
      userAvatar: null,
    });
  },

  // начальная проверка данных входа, которые сохранены в ls
  initialAuthCheck: async () => {
    try {
      const authDataJSON = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!authDataJSON) return;

      set({ isPendingAuthData: true, authError: null });

      const instanceData: IInstanceData = JSON.parse(authDataJSON);

      const data = await get().checkInstance(instanceData);

      set({
        authError: null,
        isAuthorized: true,
        instanceData,
        userName: data.username,
        userAvatar: data.avatar,
      });
    } finally {
      set({ isPendingAuthData: false });
    }
  },
}));
