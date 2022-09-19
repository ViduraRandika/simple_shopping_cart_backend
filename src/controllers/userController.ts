import { validate } from "class-validator";
import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { User } from "../models/User";
import bcrypt = require("bcryptjs");
import { Product } from "../models/Product";
import { getUserIdFromToken } from "../Utils/tokenData";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      secondaryEmail,
      phoneNo,
      address,
      profilePicImagePath,
    } = data;

    let user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.is_admin = false;
    user.address = address;
    user.phoneNo = phoneNo;
    user.secondaryEmail = secondaryEmail;
    user.profilePicImagePath = profilePicImagePath;

    const user_errors = validate(user);

    if ((await user_errors).length > 0)
      return res.send({ error: await user_errors });
    
    const userRepo = dataSource.getRepository(User);
    const userCheck = await userRepo.findOne({ where: { email: email } });

    if (userCheck) {
      res.send({ error: "Account already exists with this email" });
    } else {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await dataSource.manager.save(user);

      return res.send({ msg: "Successfully registered !, Please logged in" });
    }

    
  } catch (error) {
    console.log(error);
    return res.send({error:"Something went wrong"});
  }
};

export const uploadProfilePic = async (req:Request, res:Response) => {
  let file = req.files.profilePic as UploadedFile;
  let pieces = (file.name.split("."));
  const ext = pieces[pieces.length - 1]

  if (file) {
    const imgId = uuidv4();
    const file_name = `${imgId}.${ext}`;
    await file.mv("./uploads/profilePics/" + file_name);

    res.send("ok");
  }else{
    res.send("ok");
  }
  
}

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = await getUserIdFromToken(req.cookies.token);

    const userRepo = dataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });

    res.send(user);
  } catch (error) {
    console.log(error);
    res.send({error:"Something went wrong"})
  }
};

export const viewProduct = async (req: Request, res: Response) => {
  try {
    const index = req.params.index;

    const productRepo = dataSource.getRepository(Product);

    if (index == "all") {
      const products = await productRepo.find();
      res.send(products);
    } else if (index == "archieve") {
      const products = await productRepo.find({
        where: { is_archieved: true },
      });
      res.send(products);
    } else if (index == "unarchieve") {
      const products = await productRepo.find({
        where: { is_archieved: false },
      });
      res.send(products);
    } else {
      const product = await productRepo.findOne({
        where: { id: parseInt(index) },
      });
      if (product) {
        res.send(product);
      } else {
        res.status(400).send({ error: "Bad request" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};
