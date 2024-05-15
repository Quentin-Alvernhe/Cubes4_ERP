import type { UserRole } from "./UserRole";

export type User = {
  id: number;
  lastname: string;
  firstname: string;
  login: string;
  password: string;
  role: UserRole;
};
