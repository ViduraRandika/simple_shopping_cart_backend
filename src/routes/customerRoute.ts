import * as express from "express";
import { viewProduct } from "../controllers/userController";
import { customerAuthorization } from "../middlewares/authMiddleware";

const customerRoute = express.Router();
// customerRoute.post("/add-item-to-cart", addItemToCart);
// customerRoute.get("/view-profile",viewProfile)
// customerRoute.post("/update-profile", updateProfile)
// customerRoute.get("/get-shopping-cart-items", viewCartItems);
export default customerRoute;
