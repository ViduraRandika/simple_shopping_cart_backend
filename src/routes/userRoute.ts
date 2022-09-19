import * as express from "express";
import { viewProduct } from "../controllers/userController";
const userRoute = express.Router();
userRoute.get("/view-product/:index", viewProduct);
export default userRoute;