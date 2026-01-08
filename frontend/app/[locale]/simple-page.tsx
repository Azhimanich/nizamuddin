export default function SimplePage() {
  return (
    <html>
      <head>
        <title>Pesantren Nizamuddin</title>
      </head>
      <body style={{ margin: 0, padding: '50px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f9ff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h1 style={{ color: '#0284c7', fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>
            🕌 Pondok Pesantren Nizamuddin
          </h1>
          <p style={{ fontSize: '24px', color: '#666', textAlign: 'center', marginBottom: '40px' }}>
            Selamat Datang di Website Resmi Pondok Pesantren Nizamuddin
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
            <div style={{ padding: '20px', backgroundColor: '#e0f2fe', borderRadius: '8px' }}>
              <h2 style={{ color: '#0284c7', marginBottom: '10px' }}>📚 Program Unggulan</h2>
              <p>Tahfidz Al-Quran, Bahasa Arab, dan Kitab Kuning</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#e0f2fe', borderRadius: '8px' }}>
              <h2 style={{ color: '#0284c7', marginBottom: '10px' }}>👨‍🏫 Ketenagaan</h2>
              <p>Ustadz dan Ustadzah berpengalaman</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#e0f2fe', borderRadius: '8px' }}>
              <h2 style={{ color: '#0284c7', marginBottom: '10px' }}>📰 Berita</h2>
              <p>Update terbaru dari pesantren</p>
            </div>
          </div>
          
          <div style={{ marginTop: '40px', textAlign: 'center', padding: '20px', backgroundColor: '#0284c7', color: 'white', borderRadius: '8px' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>
              ✅ Website berjalan dengan baik! Server Next.js aktif di port 3000.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}

