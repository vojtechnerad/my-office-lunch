import z from 'zod';

export function jsonContent(schema: z.ZodType, description: string) {
  return {
    content: {
      'application/json': {
        schema: schema,
      },
    },
    description: description,
  };
}
