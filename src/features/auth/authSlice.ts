import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  email: string;
  mobileNumber?: string;
  fullName: string;
  birthDate?: string;
  isAdmin: boolean;
  address?: string;
};

type AuthState = {
  user: User | null;
  isProfileComplete: boolean;
};

const initialState: AuthState = {
  user: null,
  isProfileComplete: false,
};

const isProfileComplete = (user: Partial<User>) => {
  return Boolean(user.address && user.mobileNumber && user.birthDate);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isProfileComplete = isProfileComplete(action.payload);
    },
    logout: (state) => {
      state.user = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.isProfileComplete = isProfileComplete(state.user);
      }
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
