import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../Utils/VerifyToken";

//both logged in admin and customer users can access
export const userAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = verifyToken(token);
    if (verify) {
      res.send(verify);
    } else {
      res.send({ error: "Unauthorized request" });
    }
  } catch (error) {
    res.status(401).send({ error: "Unauthorized request" });
  }
};

//only logged in customer can access
export const customerAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = verifyToken(token);
    if (verify && verify.is_admin == false) {
      next();
    } else {
      res.send({ error: "Unauthorized request" });
    }
  } catch (error) {
    
    res.status(401).send({ error: "Unauthorized request" });
  }
};

//only logged in admin can access
export const adminAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = verifyToken(token);
    if (verify && verify.is_admin == true) {
      next();
    } else {
      res.send({ error: "Unauthorized request" });
    }
  } catch (error) {
    res.status(401).send({ error: "Unauthorized request" });
  }
};

export const verifyTokenExists =async (req:Request,res:Response, next:NextFunction) => {
  try {
    const token = req.cookies.token;
    if (token) {
      return next()
    } else { 
      res.send({ status: 401, message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.send({erro:"Something went wrong"})
  }
}
