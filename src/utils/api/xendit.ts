// utils/api/payment.ts
import axios from '@/utils/axios';

type CreateInvoiceResponse = {
  invoiceURL: string;
  paymentId: string;
};

export const apiCreateXenditInvoice = async ({
  orderId, 
  userId,
  amount,
  customerName,
  customerEmail,
}: {
  orderId: string;
  userId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}): Promise<CreateInvoiceResponse> => {
  const res = await axios.post('/xendit', {
    orderId, 
    userId,
    amount,
    customerName,
    customerEmail,
  });
  return res.data;
};