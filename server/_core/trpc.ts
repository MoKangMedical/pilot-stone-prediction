// tRPC server setup - stub for local development
import { initTRPC } from "@trpc/server"

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure // In production, add auth middleware
export const middleware = t.middleware
