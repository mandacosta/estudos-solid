import { Prisma, CheckIn } from '@prisma/client'
import { ICheckInsRepository } from '../interface-check-ins-repository'
import { prisma } from '@/libs/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
        user_id: userId,
      },
    })

    return checkIn
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    return checkIn
  }

  async save(checkin: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: checkin.id,
      },
      data: checkin,
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIn = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIn
  }

  async countByUserId(userId: string) {
    const numberOfCheckins = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return numberOfCheckins
  }
}
