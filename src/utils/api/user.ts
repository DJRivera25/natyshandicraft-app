import axios from '@/utils/axios';
import type { UpdateProfileInput } from '@/types/user'; // ✅ use your central type

export const updateUserProfile = async (
  data: UpdateProfileInput
): Promise<{ message: string }> => {
  const res = await axios.post('/user/update-profile/', data);
  return res.data;
};
