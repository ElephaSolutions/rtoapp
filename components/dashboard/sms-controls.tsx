'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SmsControls() {
  const [loading, setLoading] = useState<string | null>(null)

  const sendSms = async (type: '30_days' | '25_days' | '20_days') => {
    setLoading(type)
    try {
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Failed to send SMS')
      }
    } catch (error) {
      toast.error('Failed to send SMS')
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          SMS Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground mb-4">
            Send automated SMS reminders to clients with expiring documents
          </div>
          
          <Button
            onClick={() => sendSms('30_days')}
            disabled={loading !== null}
            className="w-full justify-start"
            variant="outline"
          >
            {loading === '30_days' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send 30-Day Reminders
          </Button>
          
          <Button
            onClick={() => sendSms('25_days')}
            disabled={loading !== null}
            className="w-full justify-start"
            variant="outline"
          >
            {loading === '25_days' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send 25-Day Reminders
          </Button>
          
          <Button
            onClick={() => sendSms('20_days')}
            disabled={loading !== null}
            className="w-full justify-start"
            variant="outline"
          >
            {loading === '20_days' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send 20-Day Reminders
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
