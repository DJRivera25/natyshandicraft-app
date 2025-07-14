// Main user type used across your frontend
export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface User {
  email: string;
  fullName: string;
  isAdmin: boolean;
  mobileNumber?: string;
  birthDate?: string; // ISO string in frontend
  address?: Address;
}

// Input used when updating profile (e.g. in complete-profile page)
export interface UpdateProfileInput {
  birthDate: string;
  mobileNumber: string;
  address: Address;
}

// Optional: If you ever fetch a user list from admin dashboard
export interface UserWithId extends User {
  _id: string;
}

// For admin/analytics: includes meta fields from backend
export interface UserWithMeta extends User {
  _id: string;
  createdAt: string;
  status?: 'active' | 'banned';
}
