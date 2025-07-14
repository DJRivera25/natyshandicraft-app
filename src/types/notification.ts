export interface Notification {
  _id: string;
  type: string;
  message: string;
  meta?: Record<string, unknown>;
  targetAdminId?: string;
  read: boolean;
  createdAt: string;
  // Add other fields as needed
}
