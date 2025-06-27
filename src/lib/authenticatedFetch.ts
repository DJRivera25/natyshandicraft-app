import axios from 'axios';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export const serverFetch = async (req: NextRequest, url: string) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const response = await axios.get(`${process.env.NEXTAUTH_URL}/api${url}`, {
    headers: {
      Authorization: `Bearer ${token?.id}`,
    },
  });

  return response.data;
};
