import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { URL } from 'url'
import { Environment } from 'vitest'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
// DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid?schema=public"
// A ideia é criar um URL para cada suite de testes

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('You have to provide a DATABASE URL')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const dataBaseURL = generateDatabaseURL(schema)
    console.log(dataBaseURL)
    process.env.DATABASE_URL = dataBaseURL

    execSync('npx prisma migrate deploy')
    // Deploy indica que pode pular as verificações de se existe ou não aquela migration

    return {
      async teardown() {
        console.log('TearDown')
        await prisma.$executeRawUnsafe(
          `DROP schema IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
