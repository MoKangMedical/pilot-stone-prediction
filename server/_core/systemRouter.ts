// System router - health check and system endpoints
import { router, publicProcedure } from "./trpc"

export const systemRouter = router({
  health: publicProcedure.query(() => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })),
})
