import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    sifre: '',
    sifreTekrar: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister) {
      if (formData.sifre !== formData.sifreTekrar) {
        alert('Şifreler eşleşmiyor!');
        return;
      }
      // Kayıt işlemi (gerçek uygulamada API'ye gönderilir)
      console.log('Kayıt Bilgileri:', formData);
      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      setIsRegister(false);
    } else {
      // Giriş işlemi (gerçek uygulamada API'ye gönderilir)
      console.log('Giriş Bilgileri:', { email: formData.email, sifre: formData.sifre });
      alert('Giriş başarılı!');
      navigate('/arac-kontrol');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
        </h1>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Ad</label>
                  <input
                    type="text"
                    name="ad"
                    value={formData.ad}
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
                    value={formData.soyad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">E-posta</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Şifre</label>
            <input
              type="password"
              name="sifre"
              value={formData.sifre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isRegister && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Şifre Tekrar</label>
              <input
                type="password"
                name="sifreTekrar"
                value={formData.sifreTekrar}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold mb-4"
          >
            {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-gray-600">
          {isRegister ? 'Zaten hesabınız var mı?' : 'Hesabınız yok mu?'}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 hover:underline font-semibold"
          >
            {isRegister ? 'Giriş Yapın' : 'Kayıt Olun'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;