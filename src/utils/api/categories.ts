import axiosInstance from '@/utils/axios';

export const apiFetchCategories = async (): Promise<string[]> => {
  const res = await axiosInstance.get('/products/categories');
  return res.data;
};
