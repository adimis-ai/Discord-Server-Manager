import React, { useEffect } from 'react'
import Home from './page/Home';
import Auth from './page/Auth';
import Pricing from './page/Pricing';
import { refreshAccessToken } from './modules/api/authHandler';

import { MemoryRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {

  useEffect(() => {
    const tokenRefreshInterval = setInterval(refreshAccessToken, 3600000);
    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, []);


  return (
    <Router>
      <div>
        <section>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;