import { PrismaClient } from "@prisma/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { createClient } from "@libsql/client"

const client = createClient({
  url: "file:./dev.db",
})

const adapter = new PrismaLibSQL(client)
const prisma = new PrismaClient({ adapter } as any)

export default prisma