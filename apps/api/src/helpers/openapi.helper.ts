import z from 'zod';

export function jsonContent<TSchema extends z.ZodType>(
  schema: TSchema,
  description: string,
) {
  return {
    content: {
      'application/json': {
        schema: schema,
      },
    },
    description: description,
  };
}
