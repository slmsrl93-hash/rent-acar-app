import React, { useState } from 'react';

const Mobiliz = () => {
  const [form, setForm] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    mesaj: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Mobiliz Formu:', form);
    alert('Mesajınız alındı! En kısa sürede size döneriz.');
    setForm({
      ad: '',
      soyad: '',
      email: '',
      telefon: '',
      mesaj: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Mobiliz</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Bilgi Kartı */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Hakkımızda</h2>
            <p className="text-gray-700 mb-4">
              Mobiliz, araç kiralama sektöründe yenilikçi çözümler sunan bir platformdur. 
              Müşterilerimize en iyi deneyimi sunmak için sürekli olarak geliştirmeler yapıyoruz.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Neden Mobiliz?</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ Hızlı ve kolay rezervasyon</li>
              <li>✅ Geniş araç filosu</li>
              <li>✅ Rekabetçi fiyatlar</li>
              <li>✅ 7/24 müşteri desteği</li>
              <li>✅ Esnek iptal politikası</li>
            </ul>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-semibold">📞 Hızlı İletişim</p>
              <p className="text-gray-700">+90 212 123 45 67</p>
              <p className="text-gray-700">info@mobiliz.com</p>
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Bize Ulaşın</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Ad</label>
                  <input
                    type="text"
                    name="ad"
                    value={form.ad}
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
                    value={form.soyad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  name="telefon"
                  value={form.telefon}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Mesajınız</label>
                <textarea
                  name="mesaj"
                  value={form.mesaj}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>

        {/* Harita Bölümü (Opsiyonel) */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">Bizi Ziyaret Edin</h2>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Harita entegrasyonu için Google Maps API kullanılabilir</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mobiliz;