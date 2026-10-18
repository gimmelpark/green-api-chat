import { RECEIVE_NOTIFICATIONS_TIMEOUT_SECONDS } from "@/common/constants";
import type { IAccountSettings, IInstanceData, IInstanceSettings } from "@/models/auth";
import type {
  ICheckAccountResponse,
  IGetContactInfoResponse,
  IReceivedNotification,
  ISendMessageResponse,
} from "@/models/chat";
import { httpFetch } from "./client";

export function getInstanceSettings({ apiUrl, idInstance, apiTokenInstance }: IInstanceData) {
  const url = `${apiUrl}/waInstance${idInstance}/getSettings/${apiTokenInstance}`;

  return httpFetch<IInstanceSettings>(url);
}

export function getAccountSettings({ apiUrl, idInstance, apiTokenInstance }: IInstanceData) {
  const url = `${apiUrl}/waInstance${idInstance}/getAccountSettings/${apiTokenInstance}`;

  return httpFetch<IAccountSettings>(url);
}

export function checkAccount(
  { apiUrl, idInstance, apiTokenInstance }: IInstanceData,
  { phone, name }: { phone?: number; name?: string },
) {
  const url = `${apiUrl}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`;

  const body: { username?: string; phoneNumber?: number } = {};

  if (name) {
    body.username = name;
  } else {
    body.phoneNumber = phone;
  }

  return httpFetch<ICheckAccountResponse>(url, {
    method: "POST",
    body,
  });
}

export function getContactInfo(
  { apiUrl, idInstance, apiTokenInstance }: IInstanceData,
  chatId: string,
) {
  const url = `${apiUrl}/waInstance${idInstance}/getContactInfo/${apiTokenInstance}`;

  const body = {
    chatId,
  };

  return httpFetch<IGetContactInfoResponse>(url, {
    method: "POST",
    body,
  });
}

export function receiveNotification(
  { apiUrl, idInstance, apiTokenInstance }: IInstanceData,
  signal: AbortSignal,
) {
  const url = `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;

  const params = {
    receiveTimeout: RECEIVE_NOTIFICATIONS_TIMEOUT_SECONDS,
  };

  return httpFetch<IReceivedNotification | null>(url, { params, signal });
}

export function deleteNotification(
  { apiUrl, idInstance, apiTokenInstance }: IInstanceData,
  receiptId: number,
) {
  const url = `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  return httpFetch(url, { method: "DELETE" });
}

export function sendTextMessage(
  { apiUrl, idInstance, apiTokenInstance }: IInstanceData,
  chatId: string,
  message: string,
) {
  const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

  const body = {
    chatId,
    message,
  };

  return httpFetch<ISendMessageResponse>(url, { method: "POST", body });
}
