import "dotenv/config"
import path from "path"
import { defineConfig, env } from "prisma/config"

const databaseUrl = env("DATABASE_URL")

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    async adapter() {
      const { PrismaLibSQL } = await import("@prisma/adapter-libsql")
      const { createClient } = await import("@libsql/client")

      const client = createClient({
        url: databaseUrl,
      })

      return new PrismaLibSQL(client)
    },
  },
})
