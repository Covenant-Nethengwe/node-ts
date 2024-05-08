import { Express , Request, Response, NextFunction } from 'express';
import { createUserHandler } from '../controllers/user.controller';
import validateResource from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';
import { createUserSessionHandler, deleteSessionHandler, getUserSessionHandler } from '../controllers/session.controller';
import { createSessionSchema } from '../schema/session.schema';
import  { requireUser } from '../middleware/requireUser';
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from '../schema/product.schema';
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from '../controllers/product.controller';

const routes = (app: Express) => {
  app.get('/health-check', (req: Request, res: Response, next: NextFunction) => res.sendStatus(200));

  app.post('/api/users', 
    validateResource(createUserSchema), 
    createUserHandler);

  app.post('/api/sessions', 
    validateResource(createSessionSchema), 
    createUserSessionHandler);

  app.get('/api/sessions', 
    requireUser, 
    getUserSessionHandler)

  app.delete('/api/sessions', 
  requireUser, 
  deleteSessionHandler)

  app.post(
    '/api/products', 
    [requireUser, validateResource(createProductSchema)], 
    createProductHandler
  )

  app.put(
    '/api/products/:productId', 
    [requireUser, validateResource(updateProductSchema)], 
    updateProductHandler
  )

  app.get(
    '/api/products/:productId', 
    validateResource(getProductSchema), 
    getProductHandler
  )

  app.delete(
    '/api/products/:productId', 
    [requireUser, validateResource(deleteProductSchema)], 
    deleteProductHandler
  )

}

export default routes;