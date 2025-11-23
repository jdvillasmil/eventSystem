import { callTx } from "./client";

export interface AuthSession {
  userId: number;
  userName: string;
  profileId: number;
  status: string;
}

export interface UserInfo {
  id: number;
  username: string;
  name?: string;
  profileId: number;
}

export async function login(
  username: string,
  password: string
): Promise<AuthSession> {
  return callTx<AuthSession>("Auth.login", [username, password]);
}

export async function logout(): Promise<void> {
  return callTx<void>("Auth.logout");
}

export async function me(): Promise<UserInfo> {
  // si en el back el metodo es distinto, solo cambia el string
  return callTx<UserInfo>("Users.me");
}
