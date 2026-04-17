import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AracDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Bu satır var!

  // Örnek araç verileri (gerçek uygulamada API'den gelecek)
  const aracler = [
    { 
      id: 1, 
      marka: 'BMW', 
      model: '3 Serisi', 
      tip: 'Sedan', 
      yil: 2022, 
      yakit: 'Dizel', 
      vites: 'Otomatik', 
      fiyat: 1200, 
      resim: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
      aciklama: 'Konforlu ve güçlü bir araç. Mükemmel performans ve yakıt ekonomisi.',
      ozellikler: ['Klima', 'GPS', 'Deri Koltuk', 'Cam Tavan', 'Park Sensörü']
    },
    { 
      id: 2, 
      marka: 'Mercedes', 
      model: 'C Class', 
      tip: 'Sedan', 
      yil: 2023, 
      yakit: 'Benzinli', 
      vites: 'Otomatik', 
      fiyat: 1500, 
      resim: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600',
      aciklama: 'Lüks ve konforun birleşimi. Premium iç mekan ve üstün güvenlik özellikleri.',
      ozellikler: ['Klima', 'GPS', 'Deri Koltuk', 'Cam Tavan', 'Adaptif Hız Sabitleyici']
    },
    { 
      id: 3, 
      marka: 'Audi', 
      model: 'A4', 
      tip: 'Sedan', 
      yil: 2022, 
      yakit: 'Dizel', 
      vites: 'Otomatik', 
      fiyat: 1300, 
      resim: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600',
      aciklama: 'Alman mühendisliğinin mükemmel örneği. Dinamik sürüş deneyimi.',
      ozellikler: ['Klima', 'GPS', 'Deri Koltuk', 'LED Farlar', 'Şerit Takip']
    }
  ];

  // Seçili aracı bul
  const arac = aracler.find(a => a.id === parseInt(id));

  if (!arac) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Araç Bulunamadı</h1>
          <button 
            onClick={() => navigate('/arac-kontrol')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Araç Kontrol Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Geri Butonu */}
        <button 
          onClick={() => navigate('/arac-kontrol')}
          className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          ← Geri Dön
        </button>

        {/* Araç Kartı */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Resim */}
            <div>
              <img 
                src={arac.resim} 
                alt={'\${arac.marka} \${arac.model}'} 
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Bilgiler */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{arac.marka} {arac.model}</h1>
              
              {/* Özellikler */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Yıl</p>
                  <p className="font-semibold text-lg">{arac.yil}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Yakıt</p>
                  <p className="font-semibold text-lg">{arac.yakit}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Vites</p>
                  <p className="font-semibold text-lg">{arac.vites}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Tip</p>
                  <p className="font-semibold text-lg">{arac.tip}</p>
                </div>
              </div>

              {/* Fiyat */}
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <p className="text-gray-600 mb-2">Günlük Kiralama Bedeli</p>
                <p className="text-3xl font-bold text-green-600">₺{arac.fiyat}/gün</p>
              </div>

              {/* Açıklama */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Araç Hakkında</h3>
                <p className="text-gray-700 leading-relaxed">{arac.aciklama}</p>
              </div>

              {/* Özellikler Listesi */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Özellikler</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {arac.ozellikler.map((ozellik, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>{ozellik}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rezervasyon Butonu - BURADA navigate KULLANILMALI! */}
              <button 
                onClick={() => navigate('/rezervasyon?arac=\${arac.id}')}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
              >
                Hemen Kirala
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AracDetay;