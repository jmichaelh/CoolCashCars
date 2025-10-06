import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './DetailPage.css';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<any>(null);
  const [vinData, setVinData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await axios.get(`/api/vehicles/search?id=${id}`);
        setVehicle(data[0] || {});
        if (data[0]?.vin) {
          const vinResponse = await axios.get(`/api/vin/decode?vin=${data[0].vin}`);
          setVinData(vinResponse.data);
        }
      } catch (error) {
        console.error('CarAPI Error:', error);
      }
    };
    fetchVehicle();
  }, [id]);

  if (!vehicle) return <div className="loader"></div>;

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <img src={vehicle.image || 'https://via.placeholder.com/400x200?text=Car'} alt={vehicle.model} className="hero-image" />
      <h1 className="title">{vehicle.make} {vehicle.model} ({vehicle.year})</h1>
      <div className="spec-section">
        <p className="spec-label">Engine: {vinData?.engine || vehicle.engine || 'N/A'}</p>
        <p className="spec-label">Transmission: {vinData?.transmission || 'N/A'}</p>
        <p className="spec-label">Mileage: {vehicle.mileage || 'N/A'} MPG</p>
      </div>
      <motion.button
        className="ar-button"
        whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(0,123,255,0.5)' }}
        onClick={() => navigate(`/ar-test-drive/${id}`)}
      >
        AR Test Drive
      </motion.button>
      <motion.button
        className="buy-button"
        whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(40,167,69,0.5)' }}
        onClick={() => navigate(`/purchase/${id}`)}
      >
        Buy Now
      </motion.button>
    </motion.div>
  );
};

export default DetailPage;
