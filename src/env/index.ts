import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  // clientPrefix: "PUBLIC_",
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.url(),
    TEST_EMAIL: z.string().optional(),
    TEST_PASSWORD: z.string().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    TEST_EMAIL: process.env.TEST_EMAIL,
    TEST_PASSWORD: process.env.TEST_PASSWORD,
  },
  emptyStringAsUndefined: true,
});
