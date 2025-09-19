import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await prisma.client.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        address: body.address,
        licenseNumber: body.licenseNumber,
        licenseExpiryDate: body.licenseExpiryDate ? new Date(body.licenseExpiryDate) : null,
        vehicleRegistration: body.vehicleRegistration,
        registrationExpiryDate: body.registrationExpiryDate ? new Date(body.registrationExpiryDate) : null,
        insuranceExpiryDate: body.insuranceExpiryDate ? new Date(body.insuranceExpiryDate) : null,
        pollutionExpiryDate: body.pollutionExpiryDate ? new Date(body.pollutionExpiryDate) : null,
      }
    })
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
