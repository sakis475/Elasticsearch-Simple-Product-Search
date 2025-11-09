import { ErrorModelType } from "./errorModelType";

/** App code description
 *  Code-prefix
 *
 * Server Errors (SV)
 * Authorization Errors (AU)
 * Data Errors (DT)
 * Client Errors (CL)
 * General Errors (GN)
 */

export class ErrorCode extends ErrorModelType {
  public static readonly UnknownError = {
    message: "Something went wrong..",
    appcode: "SV01",
    code: 500,
  };

  public static readonly Unauthorized = {
    message: "Unauthorized Access is Forbidden",
    appcode: "AU01",
    code: 401,
  };

  public static readonly NotFound = {
    message: "Not Found",
    appcode: "DT01",
    code: 404,
  };

  public static readonly BadRequestError = {
    message: "Bad Request",
    appcode: "CL01",
    code: 400,
  };

  public static readonly RequestTimeoutError = {
    message: "Request Timed Out",
    appcode: "CL02",
    code: 408,
  };
}
