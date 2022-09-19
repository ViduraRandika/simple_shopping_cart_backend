import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { User } from "../models/User";
import bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();

export const login = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };

    const { email, password } = data;

    if (!email || !password)
      return res.status(500).send("Email and password required");

    const userRepo = dataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { email: email } , select: ["id","firstName","lastName","email","is_admin","password"]});

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        let token = jwt.sign(
          {
            id: user.id,
            fistName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            is_admin: user.is_admin
          },
          process.env.JWT_SECRET,
          { expiresIn: "86400s" }
        );

        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: false,
            secure: false,
          })
          .send({"status": 200}).send();
        
      } else {
        res.send({"status": 401}).send();
      }
    } else {
      res.send({"status": 401}).send();
    }
  } catch (error) {
    console.log(error);
    return res.send({ error: "Something went wrong" });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    
    const userId = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    ).id;

    const userRepo = dataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });

    return user;
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: "Internal server error" });
  }
};

export const isAdmin = async (req: Request, res: Response) => {
  const user = await getUserData(req, res);
  if (user && user["is_admin"]) {
    res.send({ admin: true });
  } else {
    res.send({ status: 401, message: "Unauthorized" });
  }
};

export const isCustomer = async (req: Request, res: Response) => {
  try {
    const user = await getUserData(req, res);
    
    if (user && !user['is_admin']) {
      res.send({ customer: true });
    } else {
      res.send({ status: 401, message: "Unauthorized" });
    }
  } catch (error) {
    res.send({ error: "Something went wrong" });
  }
};

export const isGuest =async (req:Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const user = await getUserData(req, res);
      if (user["is_admin"]) {
        res.send({ admin: true });
      } else {
        res.send({ customer: true });
      }
    } else {
      res.send({ guest: true });
    }
  } catch (error) {
    console.log(error);
    res.send({ error: "Something went wrong" });
  }
}

export const authorizeUser = async (req: Request, res: Response) => {
  console.log(req.headers.cookie);
  res.send("JSON.stringify(req)");
};
