import e, { NextFunction, Request, Response } from "express";
import { ErrorCode } from "./errorCode";
import { ErrorModelType } from "./errorModelType";
import { ErrorException } from "./errorException";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    return next();
  }
  if (err instanceof ErrorException) {
    return res.status(err.code).json(err);
  } else {
    // unhandled errors returns with 500 status
    return res.status(500).json({
      message: ErrorCode.UnknownError.message,
      code: 500,
    });
  }
};

export const catchWrapper =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (err instanceof ErrorModelType) {
        return res.status(err.code).json(err);
      } else {
        //custom throw error
        if (err.message && err.code) {
          return res.status(500).json({
            message: err.message,
            code: err.code,
          });
        }

        // unhandled errors returns with 500 status
        return res.status(500).json({
          message: ErrorCode.UnknownError.message,
          code: 500,
        });
      }
    });
  };

export const customResponseError = (
  res: Response,
  statusCode: number,
  errorMessage: string
) => {
  return res
    .status(statusCode)
    .json({ message: errorMessage, code: statusCode });
};
