import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});
export type LoginInput = z.infer<typeof LoginSchema>;
