import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Address = {
  street: string;
  brgy: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

type User = {
  id: string;
  email: string;
  mobileNumber?: string;
  fullName: string;
  birthDate?: string;
  isAdmin: boolean;
  address?: Address;
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
  const addr = user.address;
  return Boolean(
    user.birthDate &&
      user.mobileNumber &&
      addr?.street &&
      addr?.city &&
      addr?.province &&
      addr?.postalCode
  );
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
      state.isProfileComplete = false;
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
