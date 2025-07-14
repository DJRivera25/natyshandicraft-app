import axios from '../axios';
import { Notification } from '@/types/notification';

export const getNotifications = async (): Promise<Notification[]> => {
  const { data } = await axios.get('/api/admin/notifications');
  return data.notifications;
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await axios.patch(`/api/admin/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (
  ids: string[]
): Promise<void> => {
  await Promise.all(
    ids.map((id) => axios.patch(`/api/admin/notifications/${id}/read`))
  );
};
