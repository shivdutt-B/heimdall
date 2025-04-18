import { atom } from "recoil";

interface User {
//   id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const authState = atom<AuthState>({
  key: "authState",
  default: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
});
