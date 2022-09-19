import * as express from "express";
import fileUpload = require("express-fileupload");
import * as cors from "cors";
import cookieParser = require("cookie-parser");
import { dataSource } from "./data-source";
import adminRoute from "./routes/adminRoute";
import authRoute from "./routes/authRoute";
import customerRoute from "./routes/customerRoute";
import userRoute from "./routes/userRoute";

require("dotenv").config();

// establish database connection
dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const options: cors.CorsOptions = {
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "http://localhost:3000",
  preflightContinue: false,
};

// create and setup express app
const app = express();

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(cors(options));
// // register routes
app.use("/", authRoute);
app.use("/admin", adminRoute);
app.use("/customer", customerRoute);
app.use("/user", userRoute);

// start express server
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening in port : ${process.env.PORT}`);
});
