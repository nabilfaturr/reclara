import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@reclara/db";
import { authSchema } from "@reclara/db";
import { nextCookies } from "better-auth/next-js";

const DEFAULT_PROMPT = "select_account";

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 1, // 1 day
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 * 1, // 1 day
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: authSchema,
  }),
  socialProviders: {
    google: {
      prompt: DEFAULT_PROMPT,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      prompt: DEFAULT_PROMPT,
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
});
