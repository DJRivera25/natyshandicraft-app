import axios from '@/utils/axios';
import type { UpdateProfileInput } from '@/types/user'; // ✅ use your central type

export const updateUserProfile = async (
  data: UpdateProfileInput
): Promise<{ message: string }> => {
  const res = await axios.post('/user/update-profile/', data);
  return res.data;
};

export const apiFetchAllUsers = async () => {
  const res = await axios.get('/admin/users');
  return res.data;
};

export const getChatSupportAdmin = async () => {
  const res = await axios.get('/user/admin');
  return res.data.admin;
};

export const getAllChatSupportAdmins = async () => {
  const res = await axios.get('/user/chat-support');
  return res.data.admins;
};

export const getSuperAdmin = async () => {
  const res = await axios.get('/user/super-admin');
  return res.data.superAdmin;
};

export const updateUserRoles = async (
  userId: string,
  roles: { isAdmin?: boolean; isChatSupport?: boolean; isSuperAdmin?: boolean }
) => {
  const res = await axios.patch(`/admin/users/${userId}`, roles);
  return res.data.user;
};
