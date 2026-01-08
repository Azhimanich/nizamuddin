import { DailyScheduleCalendar } from '@/components/academic/DailyScheduleCalendar'

export default function DailySchedulesPage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <DailyScheduleCalendar locale={params.locale} />
    </div>
  )
}
