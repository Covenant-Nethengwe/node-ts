import mongoose from 'mongoose';
import { UserDocument } from './user.model';
import { Guid } from 'guid-ts';

export interface ProductInput {
  user: UserDocument['_id'];
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface ProductDocument extends ProductInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    default: () => `product_${Guid.newGuid()}`
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const ProductModel = mongoose.model<ProductDocument>("Product", ProductSchema);

export default ProductModel;
