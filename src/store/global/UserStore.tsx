import { registerUser, loginUser, logout } from 'entities/User/api';
import type { RegisterUserPayload, User } from 'entities/User/types';
import { makeAutoObservable, runInAction } from 'mobx';

class UsersStore {
  user: User | null = null;
  isLoading = false;
  error: string | null = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    this.checkAuth();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  checkAuth() {
    const token = localStorage.getItem('authToken');
    if (token) this.isAuthenticated = true;
  }

  async login(identifier: string, password: string) {
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      const response = await loginUser({
        identifier: identifier,
        password: password,
      });
      runInAction(() => {
        this.user = response.user;
        this.isAuthenticated = true;
      });
      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : String(error);
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async register(data: RegisterUserPayload) {
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      const response = await registerUser(data);
      runInAction(() => {
        this.user = response.user;
        this.isAuthenticated = true;
      });
      return response;
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Registration failed';
      });
      throw err;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async logout() {
    try {
      await logout();
    } finally {
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
      });
    }
  }
}

export const UserStore = new UsersStore();

export { UsersStore };
