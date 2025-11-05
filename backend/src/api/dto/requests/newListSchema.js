import { Joi } from 'joi';

export const newListSchema = Joi.object({
    name: Joi.string().alphanum().min(1).max(50).required(),
    description: Joi.string().optional()
});