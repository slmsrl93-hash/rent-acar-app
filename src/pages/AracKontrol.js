import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AracKontrol = () => {
  const [filtrelemeDurumu, setFiltrelemeDurumu] = useState({
    tip: '',
    yakit: '',
    vites: '',
    fiyatMin: '',
    fiyatMax: ''
  });

  // Araç listesi (array olmalı!)
  const aracleri = [
    { 
      id: 1, 
      marka: 'BMW', 
      model: '3 Serisi', 
      tip: 'Sedan', 
      yil: 2022, 
      yakit: 'Dizel', 
      vites: 'Otomatik', 
      fiyat: 1200, 
      resim: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600'
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
      resim: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600'
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
      resim: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600'
    },
    { 
      id: 4, 
      marka: 'Volkswagen', 
      model: 'Golf', 
      tip: 'Hatchback', 
      yil: 2021, 
      yakit: 'Benzinli', 
      vites: 'Manuel', 
      fiyat: 900, 
      resim: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600'
    },
    { 
      id: 5, 
      marka: 'Toyota', 
      model: 'Corolla', 
      tip: 'Sedan', 
      yil: 2023, 
      yakit: 'Hibrit', 
      vites: 'Otomatik', 
      fiyat: 1100, 
      resim: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=600'
    },
    { 
      id: 6, 
      marka: 'Ford', 
      model: 'Focus', 
      tip: 'Hatchback', 
      yil: 2022, 
      yakit: 'Dizel', 
      vites: 'Manuel', 
      fiyat: 1000, 
      resim: 'https://images.unsplash.com/photo-1542282088-fe8426682b1f?w=600'
    }
  ];

  const handleFiltreleme = (e) => {
    const { name, value } = e.target;
    setFiltrelemeDurumu(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filtrelesizAraclar = aracleri.filter(arac => {
    return (
      (!filtrelemeDurumu.tip || arac.tip === filtrelemeDurumu.tip) &&
      (!filtrelemeDurumu.yakit || arac.yakit === filtrelemeDurumu.yakit) &&
      (!filtrelemeDurumu.vites || arac.vites === filtrelemeDurumu.vites) &&
      (!filtrelemeDurumu.fiyatMin || arac.fiyat >= parseInt(filtrelemeDurumu.fiyatMin)) &&
      (!filtrelemeDurumu.fiyatMax || arac.fiyat <= parseInt(filtrelemeDurumu.fiyatMax))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Araç Kontrol</h1>

        {/* Filtreler */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filtrele</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Araç Tipi</label>
              <select
                name="tip"
                value={filtrelemeDurumu.tip}
                onChange={handleFiltreleme}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="Crossover">Crossover</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Yakıt Tipi</label>
              <select
                name="yakit"
                value={filtrelemeDurumu.yakit}
                onChange={handleFiltreleme}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                <option value="Benzinli">Benzinli</option>
                <option value="Dizel">Dizel</option>
                <option value="Hibrit">Hibrit</option>
                <option value="Elektrikli">Elektrikli</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Vites Tipi</label>
              <select
                name="vites"
                value={filtrelemeDurumu.vites}
                onChange={handleFiltreleme}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                <option value="Manuel">Manuel</option>
                <option value="Otomatik">Otomatik</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Minimum Fiyat (₺)</label>
              <input
                type="number"
                name="fiyatMin"
                value={filtrelemeDurumu.fiyatMin}
                onChange={handleFiltreleme}
                placeholder="Örn: 800"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Maksimum Fiyat (₺)</label>
              <input
                type="number"
                name="fiyatMax"
                value={filtrelemeDurumu.fiyatMax}
                onChange={handleFiltreleme}
                placeholder="Örn: 2000"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFiltrelemeDurumu({
                  tip: '',
                  yakit: '',
                  vites: '',
                  fiyatMin: '',
                  fiyatMax: ''
                })}
                className="w-full bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>

        {/* Araç Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrelesizAraclar.length > 0 ? (
            filtrelesizAraclar.map((arac) => (
              <Link
                key={arac.id}
                to={'/arac/\${arac.id}'}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition cursor-pointer"
              >
                <img
                  src={arac.resim}
                  alt={'\${arac.marka} \${arac.model}'}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2">{arac.marka} {arac.model}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {arac.tip} • {arac.yakıt} • {arac.vites}
                  </p>
                  <p className="text-blue-600 font-bold text-lg">₺{arac.fiyat}/gün</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">
              Seçilen filtrelere uygun araç bulunamadı.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AracKontrol;