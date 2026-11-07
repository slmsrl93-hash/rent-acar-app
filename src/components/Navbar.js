import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            RentCar
          </Link>

          {/* Masaüstü Menü */}
          <div className="hidden md:flex space-x-6">
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

          {/* Hamburger Butonu (Mobil) */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
            onClick={() => setMenuAcik(!menuAcik)}
            aria-label="Menüyü aç/kapat"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuAcik ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuAcik ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuAcik ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobil Menü */}
        {menuAcik && (
          <div className="md:hidden border-t border-blue-500 pb-4">
            <div className="flex flex-col space-y-1 pt-2">
              <Link
                to="/"
                className="block px-2 py-2 hover:bg-blue-700 rounded transition"
                onClick={() => setMenuAcik(false)}
              >
                Anasayfa
              </Link>
              <Link
                to="/arac-kontrol"
                className="block px-2 py-2 hover:bg-blue-700 rounded transition"
                onClick={() => setMenuAcik(false)}
              >
                Araçları Gör
              </Link>
              <Link
                to="/mobiliz"
                className="block px-2 py-2 hover:bg-blue-700 rounded transition"
                onClick={() => setMenuAcik(false)}
              >
                Mobiliz
              </Link>
              <Link
                to="/login"
                className="block px-2 py-2 hover:bg-blue-700 rounded transition"
                onClick={() => setMenuAcik(false)}
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
