export interface User {
  userId: string;
  email: string;
  name: string;
}

export interface AuthState {
  token: string | null;
  user: User | null; 
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void; 
  logout: () => void;
  initializeAuth: () => void;
} 