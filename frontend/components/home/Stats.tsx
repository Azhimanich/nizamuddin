'use client'

import { UsersIcon, BookOpenIcon, TrophyIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Total Santri',
    value: '500+',
    icon: UsersIcon,
    color: 'text-blue-600',
  },
  {
    name: 'Program Unggulan',
    value: '10+',
    icon: BookOpenIcon,
    color: 'text-green-600',
  },
  {
    name: 'Prestasi',
    value: '100+',
    icon: TrophyIcon,
    color: 'text-yellow-600',
  },
  {
    name: 'Fasilitas',
    value: '20+',
    icon: BuildingOfficeIcon,
    color: 'text-purple-600',
  },
]

export function Stats() {
  return (
    <section className="py-20 bg-primary-600 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="text-center">
                <Icon className={`h-12 w-12 mx-auto mb-4 ${stat.color.replace('text-', 'text-white')}`} />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-200">{stat.name}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

