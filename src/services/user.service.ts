import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import UserModel, { UserDocument, UserInput } from '../models/user.model';
import { omit } from 'lodash';

export const createUser = async (input: UserInput) => {
  try {
    const user = await UserModel.create(input);

    return omit(user.toJSON(), ['password', '__v', '_id'])
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({
    email, password
  }: {
    email: string, password: string
  }) {
  const user = await UserModel.findOne({ email });
  
  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), 'password') ;
}


export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}