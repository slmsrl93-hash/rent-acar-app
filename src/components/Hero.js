import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Kiralık Araç</h1>
        <p className="text-xl mb-8">En uygun fiyatlarla, konforlu yolculuklar</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
          Hemen Kirala
        </button>
      </div>
    </section>
  );
};

export default Hero;