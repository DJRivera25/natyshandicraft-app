import Notification from '@/models/Notification';
import { pusherServer } from '@/lib/pusherServer';
import { connectDB } from '@/lib/db';

interface CreateNotificationParams {
  type: string;
  message: string;
  meta?: Record<string, unknown>;
  targetAdminId?: string;
}

export async function createNotification({
  type,
  message,
  meta,
  targetAdminId,
}: CreateNotificationParams) {
  await connectDB();
  const notification = await Notification.create({
    type,
    message,
    meta,
    targetAdminId,
  });
  await pusherServer.trigger('admin-notifications', 'new-notification', {
    _id: notification._id,
    type: notification.type,
    message: notification.message,
    createdAt: notification.createdAt,
    read: notification.read,
    meta: notification.meta,
    targetAdminId: notification.targetAdminId,
  });
  return notification;
}
