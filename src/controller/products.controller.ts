import { NextFunction, Request, Response } from "express";
import { bulkIndexDocuments } from "../lib/helpers/elasticLib";
import { ErrorException } from "../errorHandler/errorException";
import { ErrorCode } from "../errorHandler/errorCode";

export async function indexProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!Array.isArray(req.body)) {
    return next(new ErrorException(ErrorCode.BadRequestError));
  } else {
    for (const product of req.body) {
      if (
        typeof product.id !== "string" ||
        typeof product.title !== "string" ||
        typeof product.description !== "string" ||
        typeof product.price !== "string" ||
        typeof product.category !== "string" ||
        !product.id.trim() ||
        !product.title.trim() ||
        !product.description.trim() ||
        !product.category.trim()
      ) {
        //TODO: return more accurate error message
        return next(new ErrorException(ErrorCode.BadRequestError));
      }
    }
  }

  try {
    await bulkIndexDocuments("products", req.body);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
}
