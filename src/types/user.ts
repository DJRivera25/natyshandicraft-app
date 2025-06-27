// types/user.ts

// Main user type used across your frontend
export interface User {
  email: string;
  fullName: string;
  isAdmin: boolean;
  mobileNumber?: string;
  birthDate?: string; // ISO string in frontend
  address?: string;
}

// Input used when updating profile (e.g. in complete-profile page)
export interface UpdateProfileInput {
  birthDate: string;
  mobileNumber: string;
  address: string;
}

// Optional: If you ever fetch a user list from admin dashboard
export interface UserWithId extends User {
  _id: string;
}
