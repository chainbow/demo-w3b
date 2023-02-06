// This is an example of how to access a session from an API route
import { getServerSession } from "next-auth";

import type { NextApiRequest, NextApiResponse } from "next";
import auth from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const config = await auth(req, res);
  const session = await getServerSession(req, res, config);
  res.send(JSON.stringify(session, null, 2));
}
