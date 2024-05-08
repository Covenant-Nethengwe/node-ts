import { TypeOf, object, string } from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required.'
    }),
    password: string({
      required_error: 'Password is required.'
    }).min(6, 'Password too short - should be 6 chars minimum'),
    confirmPassword: string({
      required_error: 'Confirm password is required'
    }),
    email: string({
      required_error: 'Email is required'
    }).email('Not a valid email')  
    
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['passwordConfirmation']
  }),
})

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.confirmPassword'
  >;