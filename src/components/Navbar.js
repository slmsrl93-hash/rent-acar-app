import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            RentCar
          </Link>

          {/* Menü */}
          <div className="space-x-6">
            <Link to="/" className="hover:text-gray-200 transition">
              Anasayfa
            </Link>
            <Link to="/arac-kontrol" className="hover:text-gray-200 transition">
              Araçları Gör
            </Link>
            <Link to="/mobiliz" className="hover:text-gray-200 transition">
              Mobiliz
            </Link>
            <Link to="/login" className="hover:text-gray-200 transition">
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;