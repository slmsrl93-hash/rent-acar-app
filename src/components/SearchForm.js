import React, { useState } from 'react';

const SearchForm = () => {
  const [formData, setFormData] = useState({
    vehicleType: '',
    pickupDate: '',
    returnDate: '',
    ageLimit: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Arama yapıldı!');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto -mt-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Araç Tipi */}
        <div>
          <label className="block text-gray-700 mb-2">Araç Tipi</label>
          <select 
            name="vehicleType" 
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            <option value="compact">Kompakt</option>
            <option value="suv">SUV</option>
            <option value="sedan">Sedan</option>
            <option value="van">Van</option>
          </select>
        </div>

        {/* Alış Tarihi */}
        <div>
          <label className="block text-gray-700 mb-2">Alış Tarihi</label>
          <input 
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dönüş Tarihi */}
        <div>
          <label className="block text-gray-700 mb-2">Dönüş Tarihi</label>
          <input 
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Yaş Sınırı */}
        <div>
          <label className="block text-gray-700 mb-2">Yaş Sınırı</label>
          <input 
            type="number"
            name="ageLimit"
            value={formData.ageLimit}
            onChange={handleChange}
            placeholder="18+"
            min="18"
            max="99"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button 
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Araç Bul
      </button>
    </form>
  );
};

export default SearchForm;