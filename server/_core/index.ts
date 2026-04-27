// Server entry point
import express from "express"
import { createExpressMiddleware } from "@trpc/server/adapters/express"
import { ENV } from "./env"

const app = express()
app.use(express.json())

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

const PORT = ENV.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
