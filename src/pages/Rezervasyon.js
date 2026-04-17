import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Rezervasyon = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const aracId = searchParams.get('arac');

  const [kullaniciBilgileri, setKullaniciBilgileri] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    tcKimlik: '',
    ehliyetNo: '',
    baslangicTarihi: '',
    bitisTarihi: ''
  });

  const [arac, setArac] = useState(null);

  // Örnek araç verileri
  const aracler = [
    { id: 1, marka: 'BMW', model: '3 Serisi', fiyat: 1200, resim: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600' },
    { id: 2, marka: 'Mercedes', model: 'C Class', fiyat: 1500, resim: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600' },
    { id: 3, marka: 'Audi', model: 'A4', fiyat: 1300, resim: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600' }
  ];

  // Seçili aracı bul
  if (aracId) {
    const seciliArac = aracler.find(a => a.id === parseInt(aracId));
    if (seciliArac) {
      setArac(seciliArac);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKullaniciBilgileri(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Rezervasyon Bilgileri:', kullaniciBilgileri);
    alert('Rezervasyon başarıyla oluşturuldu!');
    navigate('/arac-kontrol');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Rezervasyon Formu</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Araç Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Kiralanacak Araç</h2>
            {arac ? (
              <div>
                <img src={arac.resim} alt={'\${arac.marka} \${arac.model}'} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold mb-2">{arac.marka} {arac.model}</h3>
                <p className="text-blue-600 font-bold text-lg">₺{arac.fiyat}/gün</p>
              </div>
            ) : (
              <p className="text-gray-600">Lütfen bir araç seçin.</p>
            )}
          </div>

          {/* Rezervasyon Formu */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Ad</label>
                  <input
                    type="text"
                    name="ad"
                    value={kullaniciBilgileri.ad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Soyad</label>
                  <input
                    type="text"
                    name="soyad"
                    value={kullaniciBilgileri.soyad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    name="email"
                    value={kullaniciBilgileri.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    name="telefon"
                    value={kullaniciBilgileri.telefon}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">TC Kimlik No</label>
                  <input
                    type="text"
                    name="tcKimlik"
                    value={kullaniciBilgileri.tcKimlik}
                    onChange={handleChange}
                    required
                    maxLength="11"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Ehliyet No</label>
                  <input
                    type="text"
                    name="ehliyetNo"
                    value={kullaniciBilgileri.ehliyetNo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    name="baslangicTarihi"
                    value={kullaniciBilgileri.baslangicTarihi}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Bitiş Tarihi</label>
                  <input
                    type="date"
                    name="bitisTarihi"
                    value={kullaniciBilgileri.bitisTarihi}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Rezervasyonu Tamamla
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rezervasyon;