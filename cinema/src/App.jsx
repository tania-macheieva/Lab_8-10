import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { movies } from './data/movies';
import MovieList from './components/MovieList';
import SearchBar from './components/SearchBar'; 
import SeatBooking from './components/SeatBooking'; 

import '../src/css/App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter movies based on search query
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <div className="app">
        <header>
          <div className="header-content">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z" fill="currentColor"/>
              </svg>
              <h1>Cinema Booking</h1>
            </div>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<MovieList movies={filteredMovies} />} />
            <Route path="/booking/:movieId" element={<SeatBooking />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer>
          <div className="footer-content">
            <p>© 2025 Cinema Ticket Booking</p>
            <div className="footer-links">
              <a href="#">About</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;