// scripts/check-pgvector.ts
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function checkPgVector() {
  try {
    const result = await prisma.$queryRaw<
      { extname: string; extversion: string }[]
    >`SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';`
    if (result.length > 0) {
      console.log(`pgvector is active: version ${result[0].extversion}`)
    } else {
      console.error('pgvector is not enabled')
      process.exit(1)
    }
  } catch (error) {
    console.error('Error checking pgvector:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkPgVector()
