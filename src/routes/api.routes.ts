import { Router } from "express";
import { basicAuthMiddleware } from "../auth/authMiddleware";
import { searchRouter } from "./search.router";
import { productsRouter } from "./products.router";
import { setupRouter } from "./setup.router";

export const api = Router();

api.use("/search", basicAuthMiddleware, searchRouter);
api.use("/products", basicAuthMiddleware, productsRouter);

api.use("/setup", basicAuthMiddleware, setupRouter);
