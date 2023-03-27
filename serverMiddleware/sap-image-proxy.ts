import express, { Request, Response } from 'express';
const app = express();

export const buildFinalUrl = (mediaHost: string, contextParam: string) => {
  const urlObject = new URL('/medias/', mediaHost);
  urlObject.searchParams.set('context', contextParam);

  return urlObject.href;
};

export const proxyHandler = async (req: Request, res: Response) => {
  const { contextValue } = req.params;
  const sapMediaHost = process.env.SAPCC_MEDIA_HOST;
  const finalUrl = buildFinalUrl(sapMediaHost, contextValue);

  res.redirect(finalUrl);
};

app.get('/context/:contextValue', proxyHandler);

export default app;
