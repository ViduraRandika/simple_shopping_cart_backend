import * as express from "express";
import {
  addProduct,
  archieveProduct,
  unarchieveProduct,
  updateProductDetails,
} from "../controllers/adminController";
import { viewProduct } from "../controllers/userController";
import { adminAuthorization } from "../middlewares/authMiddleware";
const adminRoute = express.Router();

adminRoute.post("/add-product", adminAuthorization, addProduct);
adminRoute.post("/update-product", adminAuthorization, updateProductDetails);
adminRoute.post("/archieve-product", adminAuthorization, archieveProduct);
adminRoute.post("/unarchieve-product", adminAuthorization, unarchieveProduct);
export default adminRoute;
