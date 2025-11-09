import { NextFunction, Request, Response } from "express";
import { addRandomProductsToIndex } from "../services/products.service";
import { ErrorException } from "../errorHandler/errorException";
import { ErrorCode } from "../errorHandler/errorCode";
import { deleteAllDocuments } from "../lib/helpers/elasticLib";

export async function addRandomProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.ENV !== "dev") {
    return next(new ErrorException(ErrorCode.BadRequestError));
  }
  const numberOfProducts = req.query.numberOfProducts
    ? parseInt(req.query.numberOfProducts as string, 10)
    : 0;

  await addRandomProductsToIndex(numberOfProducts);
  res.status(200).send();
}

export async function deleteAllDocumentsOfProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.ENV !== "dev") {
    return next(new ErrorException(ErrorCode.BadRequestError));
  }

  try {
    await deleteAllDocuments("products");
    res.status(200).send();
  } catch (error) {
    next(error);
  }
}
