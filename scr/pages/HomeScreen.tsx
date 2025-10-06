import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useState({ make: '', model: '', year: '' });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
  }, [searchParams]);

  const loadVehicles = async () => {
    if (!searchParams.make) return;
    setLoading(true);
    try {
      const { data } = await axios.get('/api/vehicles/search', {
        params: searchParams,
        baseURL: '', // Proxied via Workers
      });
      setVehicles(data || []);
    } catch (error) {
      console.error('CarAPI Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="logo">Cool Cash Cars</h1>
      <input
        className="search-bar"
        placeholder="Search Make/Model/Year"
        onChange={(e) => setSearchParams({ ...searchParams, make: e.target.value.split('/')[0] || '' })}
      />
      {loading && <div className="loader"></div>}
      <div className="grid">
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id || Math.random()}
            className="card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0,123,255,0.5)' }}
            onClick={() => navigate(`/detail/${vehicle.id}`)}
          >
            <img src={vehicle.image || 'https://via.placeholder.com/300x200?text=Car'} alt={vehicle.model} className="image" />
            <h2 className="title">{vehicle.make} {vehicle.model} ({vehicle.year})</h2>
            <p className="specs">Engine: {vehicle.engine || 'N/A'}</p>
            <p className="price">${vehicle.price_estimate || 'Contact Dealer'} <span className="deal">Deal!</span></p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
