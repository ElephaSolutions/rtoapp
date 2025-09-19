import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays, differenceInDays } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json() // "30_days", "25_days", "20_days"
    
    const now = new Date()
    let targetDate: Date
    
    switch (type) {
      case '30_days':
        targetDate = addDays(now, 30)
        break
      case '25_days':
        targetDate = addDays(now, 25)
        break
      case '20_days':
        targetDate = addDays(now, 20)
        break
      default:
        return NextResponse.json({ error: 'Invalid SMS type' }, { status: 400 })
    }

    // Find clients with documents expiring on the target date
    const clients = await prisma.client.findMany({
      where: {
        OR: [
          { licenseExpiryDate: { gte: targetDate, lt: addDays(targetDate, 1) } },
          { registrationExpiryDate: { gte: targetDate, lt: addDays(targetDate, 1) } },
          { insuranceExpiryDate: { gte: targetDate, lt: addDays(targetDate, 1) } },
          { pollutionExpiryDate: { gte: targetDate, lt: addDays(targetDate, 1) } }
        ]
      }
    })

    const smsLogs = []
    
    for (const client of clients) {
      const expiringDocs = []
      
      if (client.licenseExpiryDate && differenceInDays(client.licenseExpiryDate, now) <= parseInt(type.split('_')[0])) {
        expiringDocs.push('Driving License')
      }
      if (client.registrationExpiryDate && differenceInDays(client.registrationExpiryDate, now) <= parseInt(type.split('_')[0])) {
        expiringDocs.push('Vehicle Registration')
      }
      if (client.insuranceExpiryDate && differenceInDays(client.insuranceExpiryDate, now) <= parseInt(type.split('_')[0])) {
        expiringDocs.push('Insurance')
      }
      if (client.pollutionExpiryDate && differenceInDays(client.pollutionExpiryDate, now) <= parseInt(type.split('_')[0])) {
        expiringDocs.push('Pollution Certificate')
      }

      if (expiringDocs.length > 0) {
        const message = `Dear ${client.name}, your ${expiringDocs.join(', ')} will expire in ${type.split('_')[0]} days. Please renew them at the earliest. - RTO Office`
        
        // Log SMS (in real implementation, you would send actual SMS here)
        const smsLog = await prisma.smsLog.create({
          data: {
            clientId: client.id,
            phone: client.phone,
            message,
            type,
            status: 'sent' // In real implementation, this would be based on SMS gateway response
          }
        })
        
        smsLogs.push(smsLog)
      }
    }

    return NextResponse.json({ 
      message: `SMS sent to ${smsLogs.length} clients`,
      smsLogs 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const smsLogs = await prisma.smsLog.findMany({
      include: {
        client: {
          select: {
            name: true
          }
        }
      },
      orderBy: { sentAt: 'desc' },
      take: 100
    })
    
    return NextResponse.json(smsLogs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch SMS logs' }, { status: 500 })
  }
}
