import { validate } from "class-validator";
import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { Product } from "../models/Product";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };

    const {
      productName,
      description,
      price,
      imagePath,
      warrantyPeriod,
      extendedWarrantyRate,
    } = data;

    let product = new Product();
    product.description = description;
    product.productName = productName;
    product.price = parseFloat(price);
    product.warrantyPeriod = parseFloat(warrantyPeriod);
    product.extendedWarrantyRate = parseFloat(extendedWarrantyRate);
    product.imagePath = imagePath;
    product.is_archieved = false;

    const errors = await validate(product);
    if (errors.length > 0)
      return res.send({ errors: errors });
    
    await dataSource.manager.save(product);
    res.status(200).send({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};

export const updateProductDetails = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };

    const {
      id,
      productName,
      description,
      price,
      imagePath,
      warrantyPeriod,
      extendedWarrantyRate,
      is_archieved
    } = data;

    const productRepo = dataSource.getRepository(Product);

    await productRepo.update(id, {
      ...(productName && { productName }),
      ...(description && { description }),
      ...(price && { price }),
      ...(imagePath && { imagePath }),
      ...(warrantyPeriod && { warrantyPeriod }),
      ...(extendedWarrantyRate && { extendedWarrantyRate }),
      ...(is_archieved && { is_archieved }),
    });

    res.send({ message: "Product updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const archieveProduct = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    const { id } = data;

    let product = new Product();
    product.id = id;
    product.is_archieved = true;

    await dataSource.manager.save(product);

    res.send({ message: "Product archieved" });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};

export const unarchieveProduct = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    const { id } = data;

    let product = new Product();
    product.id = id;
    product.is_archieved = false;

    await dataSource.manager.save(product);

    res.send({ message: "Product unarchieved" });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};

