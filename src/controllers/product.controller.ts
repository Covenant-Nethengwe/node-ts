import { NextFunction, Request, Response } from "express";
import { CreateProductInput, UpdateProductInput, GetProductInput, DeleteProductInput } from "../schema/product.schema";
import { createProduct, deleteProduct, findAndUpdateProduct, findProduct } from "../services/product.service";

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput['body']>, 
  res: Response, 
  next: NextFunction
) {
  try {
    const userId = res.locals.user._id;
    const body = req.body;
    
    const product = await createProduct({ ...body, user: userId}); 

    res.send(product);
    next();
  } catch (e) {
    console.error(e);
    next();
  }
}

export async function updateProductHandler(
  req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>, 
  res: Response, 
  next: NextFunction
) {
  try {
    const userId = res.locals.user._id;
    const productId = req.params.productId;
    const body = req.body;

    const product = await findProduct({ productId });

    if (!product) return res.sendStatus(404);

    if (String(product.user) !== userId) return res.sendStatus(403);

    const updatedProduct = await findAndUpdateProduct(
      { productId }, 
      body,
      { 
        new: true 
      }
    );

    return res.send(updatedProduct);

  } catch (e) {
    console.error(e);
    
  }
}

export async function getProductHandler(
  req: Request<UpdateProductInput['params']>, 
  res: Response, 
  next: NextFunction
) {
  try {
    const productId = req.params.productId;

    const product = await findProduct({ productId });

    if (!product) return res.sendStatus(404);

    return res.send(product);

  } catch (e) {
    console.error(e);
  }
}

export async function deleteProductHandler(
  req: Request<UpdateProductInput['params']>,
  res: Response, 
  next: NextFunction
) {
  try {
    const userId = res.locals.user._id;
    const productId = req.params.productId;

    const product = await findProduct({ productId });

    if (!product) return res.sendStatus(404);

    if (String(product.user) !== userId) return res.sendStatus(403);

    await deleteProduct({ productId });

    return res.sendStatus(200);

  } catch (e) {
    console.error(e);
  }
}