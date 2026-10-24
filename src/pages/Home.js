import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Bölümü */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">RentCar</h1>
          <p className="text-xl mb-8">En uygun fiyatlarla, konforlu yolculuklar</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Hemen Kirala
          </button>
        </div>
      </section>

      {/* Öne Çıkan Araçlar */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Öne Çıkan Araçlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Araç Kartı 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400" alt="Araç" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">BMW 3 Serisi</h3>
                <p className="text-gray-600 mb-2">Otomatik • Dizel • 2022</p>
                <p className="text-blue-600 font-bold">₺1,200/gün</p>
              </div>
            </div>

            {/* Araç Kartı 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src="https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400" alt="Araç" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Mercedes C Class</h3>
                <p className="text-gray-600 mb-2">Otomatik • Benzinli • 2023</p>
                <p className="text-blue-600 font-bold">₺1,500/gün</p>
              </div>
            </div>

            {/* Araç Kartı 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=400" alt="Araç" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Audi A4</h3>
                <p className="text-gray-600 mb-2">Otomatik • Dizel • 2022</p>
                <p className="text-blue-600 font-bold">₺1,300/gün</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;