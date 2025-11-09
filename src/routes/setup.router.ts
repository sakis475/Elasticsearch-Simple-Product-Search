import { Router } from "express";
import { catchWrapper } from "../errorHandler/errorHandler";
import { addRandomProducts } from "../controller/setup.controller";

export const setupRouter = Router();

setupRouter.post("/add-random-products", catchWrapper(addRandomProducts));
