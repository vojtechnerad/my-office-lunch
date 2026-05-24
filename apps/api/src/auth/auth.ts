import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { db, DbSchema } from 'database';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: DbSchema.user,
      session: DbSchema.session,
      account: DbSchema.account,
      verification: DbSchema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [openAPI()],
});
