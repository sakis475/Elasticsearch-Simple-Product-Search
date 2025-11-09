import { NextFunction, Request, Response } from "express";
import { getProducts } from "../services/products.service";
import { ErrorException } from "../errorHandler/errorException";
import { ErrorCode } from "../errorHandler/errorCode";

export async function getProductResults(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let query = req.query.q as string;
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return [];
  }

  if (query.trim().length > 512) {
    return next(new ErrorException(ErrorCode.BadRequestError));
  }

  query = query.trim();
  const products = await getProducts(query);
  res.json(products);
}
