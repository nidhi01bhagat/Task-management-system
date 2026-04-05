import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import dotenv from "dotenv"

dotenv.config()

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
})
const prisma = new PrismaClient({ adapter } as any)

export default prisma
