// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message?: string,
  revalidated?: boolean
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (req.query.path === undefined) {
    return res.status(400).json({ message: 'Missing path' });
  }

  try {
    await res.revalidate(`/${req.query.path}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send({ message: 'Error revalidating' });
  }
}