import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import taskRoutes from "./routes/taskRoutes"

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: "*" }))
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "Task Management API is running!" })
})

app.use("/auth", authRoutes)
app.use("/tasks", taskRoutes)

app.use((req: any, res: any) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app