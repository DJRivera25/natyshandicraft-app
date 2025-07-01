import axiosInstance from '@/utils/axios';
import type { AxiosError } from 'axios';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url as string;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error('❌ Image upload failed:', error);

    throw new Error(error.response?.data?.message || 'Image upload failed');
  }
}
