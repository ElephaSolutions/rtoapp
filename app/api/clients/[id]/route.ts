import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const client = await prisma.client.update({
      where: { id: params.id },
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
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.client.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}
