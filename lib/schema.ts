import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be of atleast 4 characters")
    .max(10, "Username cannot exceed 10 characters"),
  password: z
    .string()
    .min(8, "Password must be of atleast 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const registerSchema = loginSchema.extend({
  firstName: z
    .string()
    .min(3, "First Name must have atleast 3 characters")
    .max(12, "First Name cannot exceed 12 characters"),
  lastName: z
    .string()
    .min(3, "Last Name must have atleast 3 characters")
    .max(12, "Last Name cannot exceed 12 characters"),
});
