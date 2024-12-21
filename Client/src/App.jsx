import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';

function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // .env se backend URL import karenge
  
  const [listings, setListings] = useState([]);
  
  // Fetch Listings from backend
  useEffect(() => {
    fetch(`${backendUrl}/api/properties`) // API call to fetch properties
      .then((response) => response.json())
      .then((data) => setListings(data)) // Store fetched data in state
      .catch((error) => console.error('Error fetching properties:', error));
  }, [backendUrl]);

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home listings={listings} />} /> {/* Passing listings as prop to Home */}
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/about' element={<About />} />
          <Route path='/search' element={<Search />} />
          <Route path='/listing/:listingId' element={<Listing />} />
          
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-listing' element={<CreateListing />} />
            <Route path='/update-listing/:listingId' element={<UpdateListing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
