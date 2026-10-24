import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // ✅ BrowserRouter ekledik!
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AracKontrol from './pages/AracKontrol';
import AracDetay from './pages/AracDetay';
import Login from './pages/Login';
import Rezervasyon from './pages/Rezervasyon';
import Mobiliz from './pages/Mobiliz';

const App = () => {
  return (
    <Router> {/* ✅ Router kullanıyoruz */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/arac-kontrol" element={<AracKontrol />} />
            <Route path="/arac/:id" element={<AracDetay />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rezervasyon" element={<Rezervasyon />} />
            <Route path="/mobiliz" element={<Mobiliz />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;