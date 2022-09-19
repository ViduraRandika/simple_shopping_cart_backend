import * as express from "express";
import { registerUser, uploadProfilePic } from "../controllers/userController";
import { authorizeUser, isAdmin, isCustomer, isGuest, login} from "../controllers/authController";
import { customerAuthorization, userAuthorization, verifyTokenExists } from "../middlewares/authMiddleware";

const authRoute = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/upload-profile-pic",uploadProfilePic);
authRoute.post("/login", login);
authRoute.post("/is-admin",verifyTokenExists, isAdmin);
authRoute.post("/is-customer", verifyTokenExists, isCustomer);
authRoute.post("/is-guest", isGuest);
authRoute.post("/authorize", authorizeUser);
export default authRoute;