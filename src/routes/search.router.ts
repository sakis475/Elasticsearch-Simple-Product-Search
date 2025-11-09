import { Router } from "express";
import { basicAuthMiddleware } from "../auth/authMiddleware";
import { catchWrapper } from "../errorHandler/errorHandler";
import { getProductResults } from "../controller/search.controller";

export const searchRouter = Router();

searchRouter.get("/", basicAuthMiddleware, catchWrapper(getProductResults));
