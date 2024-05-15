import { defineStore } from "pinia";
import { nextTick } from "vue";
import type { User } from "~/types/User";

export type AuthState = {
  user?: Partial<User>;
  token?: string;
  isAuthenticated: boolean;
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: undefined,
    token: undefined,
    isAuthenticated: false,
  }),

  actions: {
    async login(credentials: { login?: string; password?: string }) {
      const token = await $fetch<string>("http://localhost:8080/login", {
        method: "POST",
        body: credentials,
      });

      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        const { role, ...user } = JSON.parse(atob(token.split(".")[1]));
        this.user = {
          role: role.split("_")[1],
          ...user,
        };
        await nextTick();
      }
    },
    disconnect() {
      this.user = undefined;
      this.token = undefined;
      this.isAuthenticated = false;
      navigateTo('/')
    },
  },

  persist: true,
});
