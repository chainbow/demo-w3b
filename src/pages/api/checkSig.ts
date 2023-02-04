import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import ethSigUtil from "eth-sig-util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {address, sig, provider} = req.query;
  const msgParams = {data: "message", sig: sig} as any;
  const checkSigResult = ethSigUtil.recoverPersonalSignature(msgParams);

  if (String(address).toLowerCase() !== checkSigResult) {
    res.status(500).send({success: false});
    return;
  }
  const response = await axios.get(`http://wallet3.net/api/address?accountId=${ address }&provider=${ provider }`,
    {headers: {"apikey": process.env.API_KEY}});
  const result = response.data;
  // 这里需要在session 中设置
  res.status(200).send({success: true, result});
}


