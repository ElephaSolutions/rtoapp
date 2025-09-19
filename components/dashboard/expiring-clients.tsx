'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, differenceInDays } from "date-fns"

interface ExpiringClient {
  id: string
  name: string
  phone: string
  licenseExpiryDate?: Date | null
  registrationExpiryDate?: Date | null
  insuranceExpiryDate?: Date | null
  pollutionExpiryDate?: Date | null
}

interface ExpiringClientsProps {
  clients: ExpiringClient[]
}

export function ExpiringClients({ clients }: ExpiringClientsProps) {
  const getExpiringDocuments = (client: ExpiringClient) => {
    const now = new Date()
    const docs = []
    
    if (client.licenseExpiryDate && differenceInDays(client.licenseExpiryDate, now) <= 30) {
      docs.push({
        type: 'License',
        date: client.licenseExpiryDate,
        days: differenceInDays(client.licenseExpiryDate, now)
      })
    }
    if (client.registrationExpiryDate && differenceInDays(client.registrationExpiryDate, now) <= 30) {
      docs.push({
        type: 'Registration',
        date: client.registrationExpiryDate,
        days: differenceInDays(client.registrationExpiryDate, now)
      })
    }
    if (client.insuranceExpiryDate && differenceInDays(client.insuranceExpiryDate, now) <= 30) {
      docs.push({
        type: 'Insurance',
        date: client.insuranceExpiryDate,
        days: differenceInDays(client.insuranceExpiryDate, now)
      })
    }
    if (client.pollutionExpiryDate && differenceInDays(client.pollutionExpiryDate, now) <= 30) {
      docs.push({
        type: 'Pollution',
        date: client.pollutionExpiryDate,
        days: differenceInDays(client.pollutionExpiryDate, now)
      })
    }
    
    return docs
  }

  const getBadgeVariant = (days: number) => {
    if (days <= 7) return "destructive"
    if (days <= 15) return "secondary"
    return "outline"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents Expiring Soon</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No documents expiring in the next 30 days
            </p>
          ) : (
            clients.map((client) => {
              const expiringDocs = getExpiringDocuments(client)
              return (
                <div key={client.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{client.name}</h4>
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {expiringDocs.map((doc, index) => (
                      <Badge key={index} variant={getBadgeVariant(doc.days)}>
                        {doc.type}: {doc.days} days
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
