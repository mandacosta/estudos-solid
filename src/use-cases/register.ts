import { prisma } from '@/libs/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface UserRegister {
  name: string
  email: string
  password: string
}

export async function registerUser({ name, email, password }: UserRegister) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('Email already being used.')
  }
  const password_hash = await hash(password, 6)

  const userRepository = new PrismaUsersRepository()

  await userRepository.create({ name, email, password_hash })
}
