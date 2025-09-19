import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays } from 'date-fns'

export async function GET() {
  try {
    const now = new Date()
    const thirtyDaysFromNow = addDays(now, 30)

    // Total clients
    const totalClients = await prisma.client.count()

    // Clients with documents expiring within 30 days
    const expiringClients = await prisma.client.findMany({
      where: {
        OR: [
          {
            licenseExpiryDate: {
              gte: now,
              lte: thirtyDaysFromNow
            }
          },
          {
            registrationExpiryDate: {
              gte: now,
              lte: thirtyDaysFromNow
            }
          },
          {
            insuranceExpiryDate: {
              gte: now,
              lte: thirtyDaysFromNow
            }
          },
          {
            pollutionExpiryDate: {
              gte: now,
              lte: thirtyDaysFromNow
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        phone: true,
        licenseExpiryDate: true,
        registrationExpiryDate: true,
        insuranceExpiryDate: true,
        pollutionExpiryDate: true
      }
    })

    return NextResponse.json({
      totalClients,
      expiringCount: expiringClients.length,
      expiringClients
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
