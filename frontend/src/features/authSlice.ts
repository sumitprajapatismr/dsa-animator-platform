import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Premium Student' | 'Instructor' | 'Admin';
  isVerified: boolean;
  avatar: string;
  xp: number;
  level: number;
  coins: number;
  streak: {
    current: number;
    max: number;
  };
  badges: Array<{
    badgeId: string;
    name: string;
    icon: string;
    unlockedAt: string;
  }>;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialToken = localStorage.getItem('token');
const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

const initialState: AuthState = {
  token: initialToken,
  user: initialUser,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<{ token: string; user: UserProfile }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStats: (state, action: PayloadAction<{ xp: number; coins: number; level: number; badges?: any[] }>) => {
      if (state.user) {
        state.user.xp = action.payload.xp;
        state.user.coins = action.payload.coins;
        state.user.level = action.payload.level;
        if (action.payload.badges) {
          state.user.badges = action.payload.badges;
        }
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    logoutUser: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

export const { authStart, authSuccess, authFailure, updateUserStats, logoutUser } = authSlice.actions;
export default authSlice.reducer;

