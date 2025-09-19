'use client'

import { useEffect, useState } from 'react'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ExpiringClients } from '@/components/dashboard/expiring-clients'
import { SmsControls } from '@/components/dashboard/sms-controls'
import { Button } from '@/components/ui/button'
import { Plus, Users, Download } from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  totalClients: number
  expiringCount: number
  expiringClients: any[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalClients: 0,
    expiringCount: 0,
    expiringClients: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadSourceCode = () => {
    window.open('/api/download', '_blank')
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
            <h1 className="text-3xl font-bold text-gray-900">RTO Client Management</h1>
            <p className="text-gray-600 mt-2">Manage client documents and send automated reminders</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={downloadSourceCode}
              variant="secondary" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Source Code
            </Button>
            <Link href="/clients">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                View All Clients
              </Button>
            </Link>
            <Link href="/clients/add">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Client
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards 
            totalClients={data.totalClients} 
            expiringCount={data.expiringCount} 
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ExpiringClients clients={data.expiringClients} />
          </div>
          <div>
            <SmsControls />
          </div>
        </div>
      </div>
    </div>
  )
}
