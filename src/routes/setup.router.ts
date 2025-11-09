import { Router } from "express";
import { catchWrapper } from "../errorHandler/errorHandler";
import {
  addRandomProducts,
  deleteAllDocumentsOfProducts,
} from "../controller/setup.controller";

export const setupRouter = Router();

setupRouter.post("/add-random-products", catchWrapper(addRandomProducts));
setupRouter.delete(
  "/delete-all-data",
  catchWrapper(deleteAllDocumentsOfProducts)
);
