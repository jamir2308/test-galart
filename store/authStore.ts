import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User, AuthState } from '@/types/auth.types';

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

export const useAuthStore = create<AuthState>(
  (persist as AuthPersist)(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, userData) => { 
        console.log("Storing token in cookie and user data in sessionStorage:", token, userData);
        Cookies.set('authToken', token, { expires: 1, secure: process.env.NODE_ENV === 'production', path: '/' });
        set({ token, user: userData, isAuthenticated: true });
      },
      logout: () => {
        console.log("Clearing token from cookie and user data from sessionStorage.");
        Cookies.remove('authToken', { path: '/' });
        set({ token: null, user: null, isAuthenticated: false });
      },
      initializeAuth: () => {
        const token = Cookies.get('authToken');
        if (token) {
          const currentState = get();
          if (token && !currentState.user) {
            console.log("Auth token found in cookie, attempting to rehydrate user from sessionStorage via persist.");
            set({ token, isAuthenticated: true }); 
          } else if (token && currentState.user) {
            set({ token, isAuthenticated: true });
          }
        }
      }
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);

if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuth();
}