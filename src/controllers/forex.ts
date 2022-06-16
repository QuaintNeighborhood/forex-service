import { Request, Response } from "express";
import { getRateFromFixer } from "../dao/fixer";

const getForex = async (req: Request, res: Response) => {
  const base: any = req.query.base;
  const symbol: any = req.query.symbol;
  const fixerRes: any = await getRateFromFixer(base, symbol);
  if (!isNaN(fixerRes)) {
    res.status(200);
  } else {
    res.status(422);
  }
  return res.send(fixerRes);
};

const getForexApollo = async (obj: any, args: any) => {
  const base: string = args.base;
  const symbol: string = args.symbol;
  const fixerRes: any = await getRateFromFixer(base, symbol);
  if (isNaN(fixerRes)) {
    throw new Error(JSON.stringify(fixerRes));
  }
  return fixerRes;
};

export { getForex, getForexApollo };
