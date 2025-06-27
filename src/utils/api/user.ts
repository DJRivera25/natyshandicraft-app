// utils/api/user.ts
import axios from '@/lib/axios';

interface UpdateProfileInput {
  birthDate: string;
  mobileNumber: string;
  address: string;
}

export const updateUserProfile = async (
  data: UpdateProfileInput
): Promise<{ message: string }> => {
  const res = await axios.post('/user/update-profile', data);
  return res.data;
};
