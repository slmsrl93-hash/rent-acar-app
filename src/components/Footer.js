import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-xl font-semibold mb-4">RentCar</h3>
            <p className="text-gray-400">
              En uygun fiyatlarla, konforlu ve güvenli araç kiralama deneyimi. 
              7/24 müşteri desteği ile yanınızdayız.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Anasayfa</Link></li>
              <li><Link to="/arac-kontrol" className="text-gray-400 hover:text-white transition">Araçları Gör</Link></li>
              <li><Link to="/mobiliz" className="text-gray-400 hover:text-white transition">Mobiliz</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition">Giriş Yap</Link></li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-xl font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +90 212 123 45 67</li>
              <li>📧 info@rentcar.com</li>
              <li>📍 İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 RentCar. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;