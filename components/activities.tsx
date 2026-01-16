'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { getActivities, type Activity } from '@/lib/supabase'
import Image from 'next/image'
import { Calendar, Clock } from 'lucide-react'

export function Activities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await getActivities()
        setActivities(data)
      } catch (error) {
        console.log('Activities not loaded (table may not exist yet)')
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  if (loading) {
    return (
      <section id="activities" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Aktiviteler</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Haftalık etkinliklerimiz ve özel aktivitelerimiz
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
          </div>
        </div>
      </section>
    )
  }

  if (activities.length === 0) {
    return null
  }

  return (
    <section id="activities" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Aktiviteler</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Haftalık etkinliklerimiz ve özel aktivitelerimiz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Activity Image - 9:16 */}
              {activity.image_url && (
                <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                  <Image
                    src={activity.image_url}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Activity Info */}
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2 text-balance line-clamp-1">
                  {activity.title}
                </h3>
                {activity.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {activity.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  {activity.specific_day && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{activity.specific_day}</span>
                    </div>
                  )}
                  {activity.time_slot && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{activity.time_slot}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
