import { Router } from "express";
import { catchWrapper } from "../errorHandler/errorHandler";
import { indexProducts } from "../controller/products.controller";

export const productsRouter = Router();

productsRouter.post("/", catchWrapper(indexProducts));
