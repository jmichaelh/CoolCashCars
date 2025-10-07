import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FinancePage from './pages/FinancePage';
import PurchasePage from './pages/PurchasePage';
import ARTestDrivePage from './pages/ARTestDrivePage';

const handleVehicleSelect = (vehicle) => {
setSelectedVehicle(vehicle);
setView(‘detail’);
setVinData({
decoded: true,
safetyRating: 5,
recalls: 0,
ownerHistory: ‘Single Owner’
});
};import React, { useState, useEffect } from ‘react’;
import { Camera, Search, Car, Shield, Zap, ArrowRight, X, CheckCircle } from ‘lucide-react’;

const CoolCashCars = () => {
const [view, setView] = useState(‘home’);
const [searchQuery, setSearchQuery] = useState(’’);
const [vehicles, setVehicles] = useState([]);
const [selectedVehicle, setSelectedVehicle] = useState(null);
const [loading, setLoading] = useState(false);
const [vinData, setVinData] = useState(null);
const [preQualified, setPreQualified] = useState(null);

// CarAPI Authentication State (handled in background)
const [carApiAuthenticated, setCarApiAuthenticated] = useState(false);

// Check for existing auth on mount and attempt auto-auth with server credentials
useEffect(() => {
const savedAuth = sessionStorage.getItem(‘carapi_auth_token’);
if (savedAuth) {
setCarApiAuthenticated(true);
loadVehiclesFromAPI();
} else {
// Attempt to authenticate with server-side credentials
fetchServerCredentials();
}
}, []);

// Fetch credentials from your server
const fetchServerCredentials = async () => {
try {
// Replace with your actual server endpoint that returns credentials
const response = await fetch(’/api/carapi-credentials’, {
method: ‘GET’,
credentials: ‘include’, // Include cookies if needed
headers: {
‘Content-Type’: ‘application/json’
}
});

```
  if (response.ok) {
    const { token, secret } = await response.json();
    
    if (token && secret) {
      // Auto-authenticate with server credentials
      await autoAuthenticateWithServerCreds(token, secret);
    } else {
      loadMockVehicles();
    }
  } else {
    // If server endpoint doesn't exist or fails, load mock data
    loadMockVehicles();
  }
} catch (error) {
  console.log('Server credentials not available, using demo data');
  loadMockVehicles();
}
```

};

// Auto-authenticate with server-provided credentials
const autoAuthenticateWithServerCreds = async (token, secret) => {
try {
const credentials = btoa(`${token}:${secret}`);
const authHeader = `Basic ${credentials}`;

```
  // Test the credentials
  const response = await fetch('https://carapi.app/api/years', {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    // Store auth
    sessionStorage.setItem('carapi_auth_token', authHeader);
    sessionStorage.setItem('carapi_token', token);
    setCarApiAuthenticated(true);
    
    // Load real vehicle data
    await loadVehiclesFromAPI();
  } else {
    loadMockVehicles();
  }
} catch (error) {
  console.error('Auto-authentication failed:', error);
  loadMockVehicles();
}
```

};

// CarAPI Authentication (removed manual authentication)
// Auto-authenticate with server-provided credentials

// Load vehicles from CarAPI
const loadVehiclesFromAPI = async () => {
try {
setLoading(true);
const authToken = sessionStorage.getItem(‘carapi_auth_token’);

```
  if (!authToken) {
    loadMockVehicles();
    return;
  }

  // Fetch makes
  const makesResponse = await fetch('https://carapi.app/api/makes', {
    headers: { 'Authorization': authToken }
  });
  
  if (!makesResponse.ok) throw new Error('Failed to fetch makes');
  
  const makes = await makesResponse.json();
  
  // Get popular makes and their models
  const popularMakes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Tesla'];
  const vehiclePromises = popularMakes.map(async (makeName) => {
    try {
      const modelsResponse = await fetch(
        `https://carapi.app/api/models?make=${makeName}&year=2023`,
        { headers: { 'Authorization': authToken } }
      );
      
      if (!modelsResponse.ok) return null;
      
      const models = await modelsResponse.json();
      return models.data ? models.data[0] : null;
    } catch {
      return null;
    }
  });

  const vehicleData = await Promise.all(vehiclePromises);
  const validVehicles = vehicleData.filter(v => v !== null);
  
  // Transform API data to our format
  const transformedVehicles = validVehicles.map((vehicle, idx) => ({
    id: vehicle.id || idx + 1,
    make: vehicle.make_display || vehicle.make || 'Unknown',
    model: vehicle.name || vehicle.model || 'Unknown',
    year: vehicle.year || 2023,
    engine: vehicle.engine_type || '2.5L 4-Cylinder',
    transmission: vehicle.transmission_type || 'Automatic',
    mileage: 28 + (idx * 2),
    price: 25000 + (idx * 5000),
    image: `https://images.unsplash.com/photo-${1621007947382 + idx}?w=400&h=250&fit=crop`,
    vin: `VIN${vehicle.id || Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    features: ['Advanced Safety', 'Premium Audio', 'Climate Control']
  }));

  setVehicles(transformedVehicles.length > 0 ? transformedVehicles : getMockVehicles());
  
} catch (err) {
  console.error('Error loading from CarAPI:', err);
  loadMockVehicles();
} finally {
  setLoading(false);
}
```

};

const loadMockVehicles = () => {
setVehicles(getMockVehicles());
};

const getMockVehicles = () => [
{
id: 1,
make: ‘Toyota’,
model: ‘Camry’,
year: 2023,
engine: ‘2.5L 4-Cylinder’,
transmission: ‘Automatic’,
mileage: 28,
price: 28500,
image: ‘https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop’,
vin: ‘4T1B11HK5KU123456’,
features: [‘Adaptive Cruise’, ‘Lane Keep Assist’, ‘Apple CarPlay’]
},
{
id: 2,
make: ‘Honda’,
model: ‘Accord’,
year: 2023,
engine: ‘1.5L Turbo’,
transmission: ‘CVT’,
mileage: 30,
price: 29800,
image: ‘https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=250&fit=crop’,
vin: ‘1HGCV1F36MA123456’,
features: [‘Honda Sensing’, ‘Wireless Charging’, ‘Sunroof’]
},
{
id: 3,
make: ‘Tesla’,
model: ‘Model 3’,
year: 2023,
engine: ‘Electric - Dual Motor’,
transmission: ‘Single-Speed’,
mileage: 130,
price: 42990,
image: ‘https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop’,
vin: ‘5YJ3E1EA8KF123456’,
features: [‘Autopilot’, ‘Supercharger’, ‘Premium Audio’]
},
{
id: 4,
make: ‘Ford’,
model: ‘F-150’,
year: 2023,
engine: ‘3.5L EcoBoost V6’,
transmission: ‘10-Speed Auto’,
mileage: 22,
price: 54000,
image: ‘https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=250&fit=crop’,
vin: ‘1FTFW1E84NFA12345’,
features: [‘Pro Trailer Backup’, ‘4WD’, ‘Tow Package’]
},
{
id: 5,
make: ‘BMW’,
model: ‘3 Series’,
year: 2023,
engine: ‘2.0L TwinPower Turbo’,
transmission: ‘8-Speed Auto’,
mileage: 26,
price: 43800,
image: ‘https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop’,
vin: ‘WBA8E1C50KA123456’,
features: [‘iDrive 8’, ‘Sport Seats’, ‘M Performance’]
},
{
id: 6,
make: ‘Chevrolet’,
model: ‘Silverado’,
year: 2023,
engine: ‘5.3L V8’,
transmission: ‘10-Speed Auto’,
mileage: 20,
price: 48500,
image: ‘https://images.unsplash.com/photo-1579655969379-f1ea5f350b29?w=400&h=250&fit=crop’,
vin: ‘1GCUYEED0MZ123456’,
features: [‘Towing Capacity 13,300 lbs’, ‘Bed Liner’, ‘Crew Cab’]
}
];

// Calculate monthly payment with interest
const calculateMonthlyPayment = (price, downPayment, termMonths, interestRate) => {
const principal = price - downPayment;
const monthlyRate = interestRate / 100 / 12;

```
if (monthlyRate === 0) {
  return Math.round(principal / termMonths);
}

const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                      (Math.pow(1 + monthlyRate, termMonths) - 1);
return Math.round(monthlyPayment);
```

};

// Get interest rate based on credit score
const getInterestRate = (creditScore) => {
const rates = {
‘excellent’: 4.5,
‘good’: 6.5,
‘fair’: 9.5,
‘poor’: 14.5
};
return rates[creditScore] || 6.5;
};

const handleSearch = (query) => {
setLoading(true);
setSearchQuery(query);

```
setTimeout(() => {
  if (query.trim() === '') {
    carApiAuthenticated ? loadVehiclesFromAPI() : loadMockVehicles();
  } else {
    const allVehicles = vehicles.length > 0 ? vehicles : getMockVehicles();
    const filtered = allVehicles.filter(v => 
      v.make.toLowerCase().includes(query.toLowerCase()) ||
      v.model.toLowerCase().includes(query.toLowerCase()) ||
      v.year.toString().includes(query)
    );
    setVehicles(filtered);
  }
  setLoading(false);
}, 500);
```

};

const HomePage = () => (
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
{/* Header */}
<div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-6 shadow-2xl relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 animate-pulse"></div>

```
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 px-6 py-3 rounded-xl">
            <img 
              src="https://i.imgur.com/n9wZQXm.png" 
              alt="Cool Cash Cars Logo" 
              className="h-20 w-auto object-contain"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.6))'
              }}
            />
          </div>
          <div>
            <p className="text-blue-300 text-sm">Browse, Research & Test Drive with AR/VR</p>
          </div>
        </div>
        {!preQualified && (
          <button
            onClick={() => setView('prequalify')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Get Pre-Qualified
          </button>
        )}
      </div>
    </div>
  </div>

  {/* Pre-Qualification Banner */}
  {preQualified && (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <div>
              <div className="font-bold text-lg">✓ You're Pre-Qualified!</div>
              <div className="text-green-100 text-sm">
                Max Budget: ${preQualified.maxBudget.toLocaleString()} • 
                Rate: {preQualified.interestRate}% APR • 
                Down Payment: ${preQualified.downPayment.toLocaleString()}
              </div>
            </div>
          </div>
          <button
            onClick={() => setPreQualified(null)}
            className="text-white hover:text-green-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Search Bar */}
  <div className="max-w-6xl mx-auto px-6 py-8">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search by Make, Model, or Year..."
        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg shadow-sm"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>

    {/* Feature Pills */}
    <div className="flex gap-3 mt-6 flex-wrap">
      <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <Camera className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium">AR Test Drive</span>
      </div>
      <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <Shield className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium">VIN Decode</span>
      </div>
      <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium">AI Simulation</span>
      </div>
    </div>
  </div>

  {/* Loading State */}
  {loading && (
    <div className="flex justify-center py-12">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  )}

  {/* Vehicle Grid */}
  {!loading && (
    <div className="max-w-6xl mx-auto px-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => {
          const isAffordable = !preQualified || vehicle.price <= preQualified.maxBudget;
          const monthlyPayment = preQualified ? 
            calculateMonthlyPayment(
              vehicle.price, 
              preQualified.downPayment, 
              preQualified.loanTerm, 
              preQualified.interestRate
            ) : null;

          return (
            <div
              key={vehicle.id}
              onClick={() => handleVehicleSelect(vehicle)}
              className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group hover:-translate-y-1 ${
                !isAffordable ? 'opacity-60' : ''
              }`}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {!isAffordable && (
                  <div className="absolute top-3 left-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Over Budget
                  </div>
                )}
                {isAffordable && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Deal!
                  </div>
                )}
                {preQualified && isAffordable && (
                  <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-center">
                    <div className="text-xs text-green-300 mb-1">Your Pre-Qualified Payment</div>
                    <div className="text-xl font-bold">${monthlyPayment}/mo</div>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-gray-600 mb-3">{vehicle.year} • {vehicle.engine}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${vehicle.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">{vehicle.mileage} MPG</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}

  {vehicles.length === 0 && !loading && (
    <div className="text-center py-12 text-gray-500">
      <Car className="w-16 h-16 mx-auto mb-4 opacity-30" />
      <p className="text-lg">No vehicles found matching your search</p>
    </div>
  )}
</div>
```

);

// Include all other page components (DetailPage, ARTestDrivePage, etc.)
// For brevity, I’ll include a simplified version - you can keep your original implementations

const DetailPage = () => (
<div className="min-h-screen bg-slate-50">
<div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 shadow-lg">
<div className="max-w-6xl mx-auto">
<button
onClick={() => setView(‘home’)}
className=“flex items-center gap-2 mb-4 hover:text-blue-300 transition-colors”
>
<X className="w-5 h-5" />
Back to Browse
</button>
<h1 className="text-3xl font-bold">
{selectedVehicle.make} {selectedVehicle.model}
</h1>
<p className="text-slate-300">{selectedVehicle.year} Model Year</p>
</div>
</div>

```
  <div className="max-w-6xl mx-auto px-6 py-8">
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <img
        src={selectedVehicle.image}
        alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
        className="w-full h-96 object-cover"
      />
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-600" />
          Specifications
        </h2>
        
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Engine</span>
            <span className="text-gray-800 font-semibold">{selectedVehicle.engine}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Transmission</span>
            <span className="text-gray-800 font-semibold">{selectedVehicle.transmission}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Fuel Economy</span>
            <span className="text-gray-800 font-semibold">{selectedVehicle.mileage} MPG</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600 font-medium">VIN</span>
            <span className="text-gray-800 font-mono text-sm">{selectedVehicle.vin}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Key Features</h3>
        <div className="space-y-2">
          {selectedVehicle.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-700">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg p-8">
          <div className="text-sm font-medium text-blue-200 mb-2">Special Price</div>
          <div className="text-5xl font-bold mb-4">
            ${selectedVehicle.price.toLocaleString()}
          </div>
          
          {preQualified && (
            <div className="bg-green-500/90 backdrop-blur-sm rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-bold">Your Pre-Qualified Payment</span>
              </div>
              <div className="text-3xl font-bold">
                ${calculateMonthlyPayment(
                  selectedVehicle.price,
                  preQualified.downPayment,
                  preQualified.loanTerm,
                  preQualified.interestRate
                )}/mo
              </div>
              <div className="text-sm text-green-100 mt-2">
                {preQualified.interestRate}% APR • {preQualified.loanTerm} months
              </div>
            </div>
          )}
          
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex justify-between mb-2">
              <span>Est. Monthly Payment</span>
              <span className="font-bold">${Math.round(selectedVehicle.price / 60)}/mo</span>
            </div>
            <div className="text-sm text-blue-100">
              {preQualified ? 'Standard rate for comparison' : 'Based on 60-month financing'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setView('ar')}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl py-4 px-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Camera className="w-6 h-6" />
          Try AR Test Drive
        </button>

        <button
          className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl py-4 px-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Zap className="w-6 h-6" />
          AI Driving Simulation
        </button>

        <button
          onClick={() => setView('purchase')}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl py-4 px-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
        >
          <ArrowRight className="w-6 h-6" />
          Buy Now
        </button>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <div className="font-bold text-gray-800 mb-1">Verified Vehicle</div>
              This vehicle has been inspected and verified. All specifications are accurate as of the inspection date.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

);

const ARTestDrivePage = () => (
<div className="min-h-screen bg-black text-white flex items-center justify-center">
<div className="text-center max-w-2xl px-6">
<div className="bg-gradient-to-br from-purple-600 to-purple-800 w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl animate-pulse">
<Camera className="w-16 h-16" />
</div>
<h1 className="text-4xl font-bold mb-4">AR Test Drive Experience</h1>
<p className="text-xl text-gray-300 mb-8">
Place the {selectedVehicle.make} {selectedVehicle.model} in your driveway using augmented reality
</p>

```
    <div className="bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-700">
      <div className="text-left space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">1</div>
          <span>Point your camera at a flat surface</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">2</div>
          <span>Tap to place the vehicle</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">3</div>
          <span>Walk around and explore</span>
        </div>
      </div>
    </div>

    <div className="flex gap-4 justify-center">
      <button
        onClick={() => setView('detail')}
        className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-3 px-8 font-bold transition-all"
      >
        Back to Details
      </button>
      <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl py-3 px-8 font-bold transition-all">
        Launch AR Camera
      </button>
    </div>
  </div>
</div>
```

);

const PreQualifyPage = () => {
const [formData, setFormData] = useState({
income: ‘’,
creditScore: ‘’,
downPayment: ‘’,
loanTerm: ‘60’
});

```
const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = (e) => {
  e.preventDefault();
  
  const interestRate = getInterestRate(formData.creditScore);
  const income = parseInt(formData.income);
  const downPayment = parseInt(formData.downPayment);
  const loanTerm = parseInt(formData.loanTerm);
  
  const monthlyIncome = income / 12;
  const maxMonthlyPayment = monthlyIncome * 0.18;
  
  const monthlyRate = interestRate / 100 / 12;
  const maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, loanTerm) - 1) / 
                        (monthlyRate * Math.pow(1 + monthlyRate, loanTerm));
  const maxBudget = Math.floor(maxLoanAmount + downPayment);
  
  setPreQualified({
    maxBudget,
    downPayment,
    loanTerm,
    interestRate,
    maxMonthlyPayment: Math.round(maxMonthlyPayment),
    income
  });
  
  setView('home');
};

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 animate-pulse"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 mb-4 hover:text-cyan-300 transition-colors"
        >
          <X className="w-5 h-5" />
          Back to Browse
        </button>
        <div className="flex items-center gap-4">
          <img 
            src="https://i.imgur.com/n9wZQXm.png" 
            alt="Cool Cash Cars Logo" 
            className="h-16 w-auto object-contain drop-shadow-2xl"
          />
          <div>
            <h1 className="text-3xl font-bold">Get Pre-Qualified</h1>
            <p className="text-blue-300">See your buying power in seconds</p>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Pre-Qualification</h2>
            <p className="text-gray-600">This won't affect your credit score</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  required
                  min="10000"
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
                  placeholder="50000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit Score Range *
              </label>
              <select
                name="creditScore"
                value={formData.creditScore}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
              >
                <option value="">Select your range...</option>
                <option value="excellent">Excellent (750+) - ~4.5% APR</option>
                <option value="good">Good (700-749) - ~6.5% APR</option>
                <option value="fair">Fair (650-699) - ~9.5% APR</option>
                <option value="poor">Poor (below 650) - ~14.5% APR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down Payment *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Loan Term *
              </label>
              <select
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
              >
                <option value="36">36 months (3 years)</option>
                <option value="48">48 months (4 years)</option>
                <option value="60">60 months (5 years)</option>
                <option value="72">72 months (6 years)</option>
                <option value="84">84 months (7 years)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Get Pre-Qualified Now
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Why Pre-Qualify?
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                <span>Know your budget before shopping</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                <span>See personalized monthly payments</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                <span>No impact on credit score</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);
```

};

const PurchasePage = () => (
<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-6">
<div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
<div className="text-center mb-8">
<div className="w-20 h-20 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
<Shield className="w-10 h-10 text-white" />
</div>
<h1 className="text-3xl font-bold text-gray-800 mb-2">Purchase Options</h1>
<p className="text-gray-600">Choose how you’d like to proceed</p>
</div>

```
    <div className="bg-slate-50 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={selectedVehicle.image}
          alt={selectedVehicle.model}
          className="w-24 h-24 rounded-xl object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {selectedVehicle.make} {selectedVehicle.model}
          </h2>
          <p className="text-gray-600">{selectedVehicle.year}</p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-lg font-bold text-green-600">
          <span>Total</span>
          <span>${(selectedVehicle.price + 299).toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div className="space-y-4 mb-6">
      <button
        onClick={() => setView('finance')}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-4 px-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
      >
        <div className="text-left">
          <div className="text-xl mb-1">Apply for Financing</div>
          <div className="text-sm text-blue-100">Get approved in minutes</div>
        </div>
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>

    <button
      onClick={() => setView('detail')}
      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl py-3 font-bold transition-all"
    >
      Back to Details
    </button>
  </div>
</div>
```

);

const FinancePage = () => {
const [formData, setFormData] = useState({
firstName: ‘’,
lastName: ‘’,
email: ‘’,
phone: ‘’
});
const [submitted, setSubmitted] = useState(false);

```
const handleSubmit = (e) => {
  e.preventDefault();
  setSubmitted(true);
};

if (submitted) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
        <p className="text-gray-600 mb-6">
          Thank you, {formData.firstName}! We'll contact you within 24-48 hours.
        </p>
        <button
          onClick={() => setView('home')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-8 font-bold transition-all"
        >
          Browse More Cars
        </button>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-slate-50 pb-12">
    <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setView('detail')} className="flex items-center gap-2 mb-4">
          <X className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-3xl font-bold">Financing Application</h1>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              required
              className="px-4 py-3 border rounded-lg"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <input
              type="text"
              placeholder="Last Name"
              required
              className="px-4 py-3 border rounded-lg"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 border rounded-lg"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="tel"
            placeholder="Phone"
            required
            className="w-full px-4 py-3 border rounded-lg"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl py-4 font-bold"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  </div>
);
```

};

return (
<div>
{view === ‘home’ && <HomePage />}
{view === ‘prequalify’ && <PreQualifyPage />}
{view === ‘detail’ && <DetailPage />}
{view === ‘ar’ && <ARTestDrivePage />}
{view === ‘finance’ && <FinancePage />}
{view === ‘purchase’ && <PurchasePage />}
</div>
);
};

export default CoolCashCars;
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/finance/:id" element={<FinancePage />} />
        <Route path="/purchase/:id" element={<PurchasePage />} />
        <Route path="/ar-test-drive/:id" element={<ARTestDrivePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
