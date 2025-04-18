import { CreateProductDTO } from "../domain/dto/product";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import Product from "../infrastructure/schemas/Product";

import { Request, Response, NextFunction } from "express";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.query;
    let data;

    if (categoryId) {
      data = await Product.find({ categoryId });
    } else {
      data = await Product.find();
    }

    if (!data || data.length === 0) {
      throw new NotFoundError("No products found");
    }

    res.json(data);
  } catch (error) {
    console.error("Error in getProducts:", error);
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = CreateProductDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid product data");
    }
    await Product.create(result.data);
    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("categoryId");
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(200).json(product).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(204).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).send(product);
    return;
  } catch (error) {
    next(error);
  }
};