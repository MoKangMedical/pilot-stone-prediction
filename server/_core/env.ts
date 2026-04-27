// Environment configuration
export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/pilot_stone",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-key",
  S3_BUCKET: process.env.S3_BUCKET || "pilot-stone",
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",
  ownerOpenId: process.env.OWNER_OPEN_ID || "",
}
