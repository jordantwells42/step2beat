import { getRecommendation } from '../../libs/spotify';

import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});
  const {query} = req;
  if (query.tempo &&  token){
    const tempo= query.tempo as string;
    const artists = query.artists as string || "";
    let limit: number;
    if (query.limit){
      limit = Number(query.limit);
    } else {
      limit = 1
    }
    const accessToken = token.accessToken as string;
    const response = await getRecommendation(accessToken, tempo, artists, limit);
    const json = await response.json();
    return res.status(200).json(json.tracks);
  }
  return res.status(400).json({});

};

export default handler;