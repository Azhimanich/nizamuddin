'use client'

import { useState } from 'react'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export function PSBRegistration({ locale = 'id' }: { locale?: string }) {
  const [formData, setFormData] = useState({
    nik: '',
    fullName: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    educationLevel: '',
    previousSchool: '',
    graduationYear: '',
    quranAbility: '',
    specialNeeds: '',
    motivation: '',
    agreement: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [errorType, setErrorType] = useState<string>('')
  const [lastNik, setLastNik] = useState('')

  const content = {
    id: {
      title: 'Formulir Pendaftaran Online',
      subtitle: 'Isi formulir di bawah ini untuk memulai proses pendaftaran',
      personalInfo: 'Informasi Pribadi',
      parentInfo: 'Informasi Orang Tua/Wali',
      educationInfo: 'Informasi Pendidikan',
      additionalInfo: 'Informasi Tambahan',
      submit: 'Kirim Pendaftaran',
      submitting: 'Mengirim...',
      success: 'Pendaftaran berhasil dikirim!',
      error: 'Terjadi kesalahan. Silakan coba lagi.',
      fields: {
        nik: 'Nomor Induk Kependudukan (NIK)',
        fullName: 'Nama Lengkap',
        birthDate: 'Tanggal Lahir',
        birthPlace: 'Tempat Lahir',
        gender: 'Jenis Kelamin',
        address: 'Alamat Lengkap',
        phone: 'Nomor Telepon',
        email: 'Email',
        parentName: 'Nama Orang Tua/Wali',
        parentPhone: 'Telepon Orang Tua/Wali',
        parentEmail: 'Email Orang Tua/Wali',
        educationLevel: 'Tingkat Pendidikan yang Dituju',
        previousSchool: 'Sekolah Asal',
        graduationYear: 'Tahun Lulus',
        quranAbility: 'Kemampuan Membaca Al-Quran',
        specialNeeds: 'Kebutuhan Khusus (jika ada)',
        motivation: 'Motivasi Bergabung',
        agreement: 'Saya menyetujui syarat dan ketentuan yang berlaku'
      },
      options: {
        gender: ['Laki-laki', 'Perempuan'],
        educationLevel: ['Kepondokan', 'TK', 'SD/MI Kelas 1', 'SD/MI Kelas 2', 'SD/MI Kelas 3', 'SD/MI Kelas 4', 'SD/MI Kelas 5', 'SD/MI Kelas 6', 'SMP/MTs Kelas 7', 'SMP/MTs Kelas 8', 'SMP/MTs Kelas 9'],
        quranAbility: ['Belum bisa', 'Dasar (hijaiyah)', 'Sedang (surat pendek)', 'Baik (surat panjang)', 'Sangat Baik (juz 30)']
      }
    },
    en: {
      title: 'Online Registration Form',
      subtitle: 'Fill in the form below to start the registration process',
      personalInfo: 'Personal Information',
      parentInfo: 'Parent/Guardian Information',
      educationInfo: 'Education Information',
      additionalInfo: 'Additional Information',
      submit: 'Submit Registration',
      submitting: 'Submitting...',
      success: 'Registration successfully submitted!',
      error: 'An error occurred. Please try again.',
      fields: {
        nik: 'National Identification Number (NIK)',
        fullName: 'Full Name',
        birthDate: 'Date of Birth',
        birthPlace: 'Place of Birth',
        gender: 'Gender',
        address: 'Full Address',
        phone: 'Phone Number',
        email: 'Email',
        parentName: 'Parent/Guardian Name',
        parentPhone: 'Parent/Guardian Phone',
        parentEmail: 'Parent/Guardian Email',
        educationLevel: 'Target Education Level',
        previousSchool: 'Previous School',
        graduationYear: 'Graduation Year',
        quranAbility: 'Quran Reading Ability',
        specialNeeds: 'Special Needs (if any)',
        motivation: 'Motivation to Join',
        agreement: 'I agree to terms and conditions'
      },
      options: {
        gender: ['Male', 'Female'],
        educationLevel: ['Kepondokan', 'Kindergarten (TK)', 'Grade 1 Elementary', 'Grade 2 Elementary', 'Grade 3 Elementary', 'Grade 4 Elementary', 'Grade 5 Elementary', 'Grade 6 Elementary', 'Grade 7 Junior High', 'Grade 8 Junior High', 'Grade 9 Junior High'],
        quranAbility: ['Cannot read', 'Basic (hijaiyah)', 'Intermediate (short surahs)', 'Good (long surahs)', 'Excellent (juz 30)']
      }
    }
  }

  const t = content[locale as keyof typeof content] || content.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/psb/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nik: formData.nik,
          nama_lengkap: formData.fullName,
          tempat_lahir: formData.birthPlace,
          tanggal_lahir: formData.birthDate,
          jenis_kelamin: formData.gender === 'Laki-laki' || formData.gender === 'Male' ? 'L' : 'P',
          alamat_lengkap: formData.address,
          nomor_telepon: formData.phone,
          email: formData.email,
          // All fields now required
          nama_orang_tua: formData.parentName,
          telepon_orang_tua: formData.parentPhone,
          email_orang_tua: formData.parentEmail,
          tingkat_pendidikan: formData.educationLevel,
          sekolah_asal: formData.previousSchool,
          tahun_lulus: formData.graduationYear ? parseInt(formData.graduationYear) : new Date().getFullYear(),
          kemampuan_quran: formData.quranAbility,
          kebutuhan_khusus: formData.specialNeeds,
          motivasi: formData.motivation
        })
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus('success')
        // Don't reset form immediately, let user see their data and success message
        setTimeout(() => {
          setSubmitStatus('idle')
          // Only reset form after user has seen success message
        }, 8000) // Extended to 8 seconds
      } else {
        setSubmitStatus('error')
        
        // Handle specific error types
        if (data.error_type === 'nik_exists') {
          setErrorMessage('NIK sudah terdaftar dalam sistem.')
          setErrorType('nik_exists')
          setLastNik(formData.nik)
        } else {
          setErrorMessage(data.message || 'Pendaftaran gagal')
          setErrorType('validation')
        }
        
        // Show specific error message from API if available
        console.error('Registration failed:', data.message)
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Terjadi kesalahan koneksi. Silakan periksa internet Anda dan coba lagi.')
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <section id="registration-form" className="py-20 bg-white pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            {t.subtitle}
          </p>
          <div className="flex justify-center">
            <a 
              href={locale === 'id' ? `/id/psb/status` : `/en/psb/status`}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {locale === 'id' ? '🔍 Cek Status Pendaftaran' : '🔍 Check Registration Status'}
            </a>
          </div>
        </div>

        
        {/* Registration Form - Hide when success */}
        {submitStatus !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <UserIcon className="h-6 w-6 text-primary-600 mr-3" />
              {t.personalInfo}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.nik} *
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  maxLength={16}
                  pattern="[0-9]{16}"
                  placeholder="Masukkan 16 digit NIK"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.fullName} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.birthPlace} *
                </label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.birthDate} *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.gender} *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">{locale === 'id' ? 'Pilih...' : 'Select...'}</option>
                  {t.options.gender.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.address} *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.phone} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.email} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <UserIcon className="h-6 w-6 text-primary-600 mr-3" />
              {t.parentInfo}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.parentName} *
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.parentPhone} *
                </label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.parentEmail} *
                </label>
                <input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Education Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-3" />
              {t.educationInfo}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.educationLevel} *
                </label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">{locale === 'id' ? 'Pilih...' : 'Select...'}</option>
                  {t.options.educationLevel.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.previousSchool} *
                </label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.graduationYear} *
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  min="2020"
                  max="2030"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.quranAbility} *
                </label>
                <select
                  name="quranAbility"
                  value={formData.quranAbility}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">{locale === 'id' ? 'Pilih...' : 'Select...'}</option>
                  {t.options.quranAbility.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CalendarIcon className="h-6 w-6 text-primary-600 mr-3" />
              {t.additionalInfo}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.specialNeeds} *
                </label>
                <textarea
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  placeholder={locale === 'id' ? 'Isi dengan detail jika ada, atau tulis "Tidak ada"' : 'Fill in details if any, or write "None"'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fields.motivation} *
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder={locale === 'id' ? 'Jelaskan mengapa Anda ingin bergabung dengan pesantren kami...' : 'Explain why you want to join our pesantren...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Agreement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreement"
                checked={formData.agreement}
                onChange={handleInputChange}
                required
                className="mt-1 mr-3"
              />
              <span className="text-blue-800 text-sm">
                {t.fields.agreement}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || !formData.agreement}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </div>

                  </form>
        )}

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-green-800 font-semibold text-lg">{t.success}</h3>
                <div className="mt-3 space-y-2">
                  <p className="text-green-700 text-sm">
                    {locale === 'id' 
                      ? 'Pendaftaran Anda berhasil dikirim! Tim kami akan segera memverifikasi data Anda.'
                      : 'Your registration has been successfully submitted! Our team will verify your data shortly.'
                    }
                  </p>
                  <div className="bg-green-100 border border-green-300 rounded p-3">
                    <p className="text-green-800 text-sm font-medium">
                      {locale === 'id' ? '📋 Langkah Selanjutnya:' : '📋 Next Steps:'}
                    </p>
                    <ul className="text-green-700 text-xs mt-2 space-y-1">
                      <li>• {locale === 'id' ? 'Verifikasi data 1-3 hari kerja' : 'Data verification 1-3 business days'}</li>
                      <li>• {locale === 'id' ? 'Hasil via WhatsApp/Email' : 'Results via WhatsApp/Email'}</li>
                      <li>• {locale === 'id' ? 'Siapkan dokumen asli' : 'Prepare original documents'}</li>
                    </ul>
                  </div>
                  <p className="text-green-600 text-xs">
                    {locale === 'id' 
                      ? 'Simpan bukti pendaftaran ini sebagai referensi.'
                      : 'Save this registration proof for reference.'
                    }
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitStatus('idle')
                    setErrorMessage('')
                    setFormData({
                      nik: '',
                      fullName: '',
                      birthPlace: '',
                      birthDate: '',
                      gender: '',
                      address: '',
                      phone: '',
                      email: '',
                      parentName: '',
                      parentPhone: '',
                      parentEmail: '',
                      educationLevel: '',
                      previousSchool: '',
                      graduationYear: '',
                      quranAbility: '',
                      specialNeeds: '',
                      motivation: '',
                      agreement: false
                    })
                  }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  {locale === 'id' ? 'Daftar Lagi' : 'Register Another'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                {errorType === 'nik_exists' ? (
                  <>
                    <h3 className="text-red-800 font-semibold text-lg">
                      {locale === 'id' ? 'Anda Sudah Terdaftar' : 'Already Registered'}
                    </h3>
                    <div className="mt-3 space-y-2">
                      <p className="text-red-700 text-sm">
                        {locale === 'id' 
                          ? 'NIK yang Anda gunakan sudah terdaftar dalam sistem.'
                          : 'The NIK you used is already registered in the system.'
                        }
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <a 
                          href={locale === 'id' ? `/id/psb/status?nik=${lastNik}` : `/en/psb/status?nik=${lastNik}`}
                          className="text-blue-700 text-sm font-medium hover:text-blue-800 flex items-center"
                        >
                          📋 {locale === 'id' ? 'Cek Status Pendaftaran' : 'Check Registration Status'}
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-red-800 font-semibold text-lg">
                      {locale === 'id' ? 'Pendaftaran Gagal' : 'Registration Failed'}
                    </h3>
                    <div className="mt-3 space-y-2">
                      <p className="text-red-700 text-sm">
                        {locale === 'id' 
                          ? 'Terjadi kesalahan. Silakan periksa kembali data Anda.'
                          : 'An error occurred. Please check your data again.'
                        }
                      </p>
                      {errorMessage && (
                        <div className="bg-red-100 border border-red-300 rounded p-2">
                          <p className="text-red-700 text-xs">{errorMessage}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <button
                  onClick={() => {
                    setSubmitStatus('idle')
                    setErrorMessage('')
                    setErrorType('')
                    setLastNik('')
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  {locale === 'id' ? 'Coba Lagi' : 'Try Again'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
