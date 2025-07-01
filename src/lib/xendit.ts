import { Xendit } from 'xendit-node';

export function getInvoiceClient() {
  const xendit = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY!,
  });

  return xendit.Invoice;
}
