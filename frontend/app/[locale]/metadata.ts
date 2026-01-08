import type { Metadata } from 'next'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = params.locale || 'id'
  
  const titles: Record<string, string> = {
    id: 'Pondok Pesantren Nizamuddin - Website Resmi',
    en: 'Nizamuddin Islamic Boarding School - Official Website',
    ar: 'مدرسة نزام الدين الإسلامية - الموقع الرسمي',
  }

  const descriptions: Record<string, string> = {
    id: 'Website resmi Pondok Pesantren Nizamuddin dengan informasi lengkap tentang profil, akademik, dan kegiatan',
    en: 'Official website of Nizamuddin Islamic Boarding School with complete information about profile, academic, and activities',
    ar: 'الموقع الرسمي لمدرسة نزام الدين الإسلامية مع معلومات كاملة عن الملف الشخصي والأكاديمي والأنشطة',
  }

  return {
    title: titles[locale] || titles.id,
    description: descriptions[locale] || descriptions.id,
    keywords: 'pesantren, pondok pesantren, pendidikan islam, tahfidz, nizamuddin',
    icons: {
      icon: '/logo.png',
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
    openGraph: {
      title: titles[locale] || titles.id,
      description: descriptions[locale] || descriptions.id,
      type: 'website',
      images: ['/logo.png'],
    },
  }
}

