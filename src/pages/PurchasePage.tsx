import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PurchasePage.css';

const PurchasePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate affiliate redirect
    console.log(`Redirecting to Carvana for vehicle ID ${id}`);
    // window.location.href = `https://www.carvana.com/?affiliate=coolcashcars&vehicle=${id}`;
  }, [id]);

  return (
    <div className="container">
      <h1 className="title">Confirm Your Deal</h1>
      <p className="summary">Vehicle ID: {id}</p>
      <p className="disclaimer">Redirecting to trusted partner (Carvana) for secure purchase.</p>
      <button className="proceed-button" onClick={() => window.location.href = 'https://www.carvana.com/?affiliate=coolcashcars'}>
        Proceed
      </button>
      <button className="cancel-button" onClick={() => navigate('/')}>
        Cancel
      </button>
    </div>
  );
};

export default PurchasePage;
