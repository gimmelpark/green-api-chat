import type { InstanceStateType } from "@/models/auth.enums";

export interface IInstanceSettings {
  typeInstance: string;
}

export interface IAccountSettings {
  avatar: string;
  username: string;
  phone: string;
  stateInstance: InstanceStateType;
}

export interface IInstanceData {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}
