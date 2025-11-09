import { Request, Response, NextFunction } from "express";
import { ErrorException } from "../errorHandler/errorException";
import { ErrorCode } from "../errorHandler/errorCode";

export const basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req?.headers?.authorization?.split(" ")?.[1];
  if (process.env.ENV === "dev" && !process.env.API_KEY) {
    return next();
  }
  if (
    req?.headers?.authorization?.startsWith("Bearer") &&
    token === process.env.API_KEY
  ) {
    return next();
  }

  return next(new ErrorException(ErrorCode.Unauthorized));
};
