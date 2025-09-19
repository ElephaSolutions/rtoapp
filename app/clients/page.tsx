'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, Edit, Trash2, Phone, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'
import { format, differenceInDays } from 'date-fns'
import { toast } from 'sonner'

interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  licenseNumber?: string
  licenseExpiryDate?: string
  vehicleRegistration?: string
  registrationExpiryDate?: string
  insuranceExpiryDate?: string
  pollutionExpiryDate?: string
  createdAt: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.licenseNumber && client.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.vehicleRegistration && client.vehicleRegistration.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredClients(filtered)
  }, [clients, searchTerm])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      toast.error('Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }

  const deleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setClients(clients.filter(client => client.id !== id))
        toast.success('Client deleted successfully')
      } else {
        toast.error('Failed to delete client')
      }
    } catch (error) {
      toast.error('Failed to delete client')
    }
  }

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null
    
    const days = differenceInDays(new Date(expiryDate), new Date())
    
    if (days < 0) return { status: 'expired', days: Math.abs(days), variant: 'destructive' as const }
    if (days <= 7) return { status: 'critical', days, variant: 'destructive' as const }
    if (days <= 30) return { status: 'warning', days, variant: 'secondary' as const }
    return { status: 'valid', days, variant: 'outline' as const }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-2">Manage all your RTO clients and their documents</p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Link href="/clients/add">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Client
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clients by name, phone, email, license, or registration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </div>
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => deleteClient(client.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {client.licenseNumber && (
                    <div>
                      <div className="text-sm font-medium">License: {client.licenseNumber}</div>
                      {client.licenseExpiryDate && (
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            Expires: {format(new Date(client.licenseExpiryDate), 'dd/MM/yyyy')}
                          </span>
                          {(() => {
                            const status = getExpiryStatus(client.licenseExpiryDate)
                            return status && (
                              <Badge variant={status.variant} className="text-xs">
                                {status.status === 'expired' ? `${status.days}d ago` : `${status.days}d left`}
                              </Badge>
                            )
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  {client.vehicleRegistration && (
                    <div>
                      <div className="text-sm font-medium">Vehicle: {client.vehicleRegistration}</div>
                      {client.registrationExpiryDate && (
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            Expires: {format(new Date(client.registrationExpiryDate), 'dd/MM/yyyy')}
                          </span>
                          {(() => {
                            const status = getExpiryStatus(client.registrationExpiryDate)
                            return status && (
                              <Badge variant={status.variant} className="text-xs">
                                {status.status === 'expired' ? `${status.days}d ago` : `${status.days}d left`}
                              </Badge>
                            )
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-3">
                    {client.insuranceExpiryDate && (() => {
                      const status = getExpiryStatus(client.insuranceExpiryDate)
                      return status && (
                        <Badge variant={status.variant} className="text-xs">
                          Insurance: {status.status === 'expired' ? `${status.days}d ago` : `${status.days}d`}
                        </Badge>
                      )
                    })()}
                    {client.pollutionExpiryDate && (() => {
                      const status = getExpiryStatus(client.pollutionExpiryDate)
                      return status && (
                        <Badge variant={status.variant} className="text-xs">
                          PUC: {status.status === 'expired' ? `${status.days}d ago` : `${status.days}d`}
                        </Badge>
                      )
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No clients found matching your search.' : 'No clients found. Add your first client to get started.'}
            </p>
            {!searchTerm && (
              <Link href="/clients/add">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Client
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
