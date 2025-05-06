import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { movies } from '../data/movies';
import '../css/SeatBooking.css';

const SeatBooking = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get movie and session data from location state or fetch based on ID
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [session, setSession] = useState(location.state?.session || null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingData, setBookingData] = useState({
    standardSeats: 0,
    vipSeats: 0,
    standardPrice: 12.99,
    vipPrice: 19.99,
    bookingFee: 1.50,
    total: 0
  });

  // If movie/session wasn't passed via location state, fetch it based on URL parameters
  useEffect(() => {
    if (!movie && movieId) {
      const foundMovie = movies.find(m => m.id === parseInt(movieId) || m.id === movieId);
      if (foundMovie) {
        setMovie(foundMovie);
        // Set first session as default if none was selected
        if (!session && foundMovie.schedule && foundMovie.schedule.length > 0) {
          setSession(foundMovie.schedule[0]);
        }
      } else {
        // Movie not found, redirect to home
        navigate('/');
      }
    }
  }, [movieId, movie, session, navigate]);

  // Sample seat data (in a real app, this would come from an API)
  const seatRows = [
    { row: 'A', seats: [
      { id: 'A1', status: 'available' }, { id: 'A2', status: 'available' },
      { id: 'A3', status: 'available' }, { id: 'A4', status: 'booked' },
      { id: 'A5', status: 'booked' }, { id: 'A6', status: 'available' },
      { id: 'A7', status: 'available' }, { id: 'A8', status: 'available' }
    ]},
    { row: 'B', seats: [
      { id: 'B1', status: 'available' }, { id: 'B2', status: 'available' },
      { id: 'B3', status: 'available' }, { id: 'B4', status: 'available' },
      { id: 'B5', status: 'available' }, { id: 'B6', status: 'available' },
      { id: 'B7', status: 'available' }, { id: 'B8', status: 'available' }
    ]},
    { row: 'C', seats: [
      { id: 'C1', status: 'available' }, { id: 'C2', status: 'available' },
      { id: 'C3', status: 'booked' }, { id: 'C4', status: 'booked' },
      { id: 'C5', status: 'booked' }, { id: 'C6', status: 'available' },
      { id: 'C7', status: 'available' }, { id: 'C8', status: 'available' }
    ]},
    { row: 'D', seats: [
      { id: 'D1', status: 'available', type: 'vip' }, { id: 'D2', status: 'available', type: 'vip' },
      { id: 'D3', status: 'available', type: 'vip' }, { id: 'D4', status: 'available', type: 'vip' },
      { id: 'D5', status: 'available', type: 'vip' }, { id: 'D6', status: 'available', type: 'vip' },
      { id: 'D7', status: 'available', type: 'vip' }, { id: 'D8', status: 'available', type: 'vip' }
    ]},
    { row: 'E', seats: [
      { id: 'E1', status: 'available', type: 'vip' }, { id: 'E2', status: 'booked', type: 'vip' },
      { id: 'E3', status: 'available', type: 'vip' }, { id: 'E4', status: 'available', type: 'vip' },
      { id: 'E5', status: 'available', type: 'vip' }, { id: 'E6', status: 'booked', type: 'vip' },
      { id: 'E7', status: 'available', type: 'vip' }, { id: 'E8', status: 'available', type: 'vip' }
    ]}
  ];
  
  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Handle seat selection
  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    
    // Check if seat is already selected
    const seatIndex = selectedSeats.findIndex(s => s.id === seat.id);
    
    let updatedSeats;
    if (seatIndex !== -1) {
      // Remove seat if already selected
      updatedSeats = [...selectedSeats];
      updatedSeats.splice(seatIndex, 1);
    } else {
      // Add seat to selection
      updatedSeats = [...selectedSeats, seat];
    }
    
    setSelectedSeats(updatedSeats);
  };
  
  // Update booking data when selected seats change
  useEffect(() => {
    const standardSeats = selectedSeats.filter(seat => !seat.type || seat.type !== 'vip').length;
    const vipSeats = selectedSeats.filter(seat => seat.type === 'vip').length;
    
    const standardTotal = standardSeats * bookingData.standardPrice;
    const vipTotal = vipSeats * bookingData.vipPrice;
    const total = standardTotal + vipTotal + (selectedSeats.length > 0 ? bookingData.bookingFee : 0);
    
    setBookingData(prev => ({
      ...prev,
      standardSeats,
      vipSeats,
      total
    }));
  }, [selectedSeats]);

  // Handler for cancel button
  const handleCancel = () => {
    navigate('/');
  };

  // Handler for proceed to payment
  const handleProceedToPayment = () => {
    // In a real app, you would redirect to a payment page or show a payment modal
    alert(`Payment for ${selectedSeats.length} seats totaling $${bookingData.total.toFixed(2)} would be processed here.`);
    // After successful payment, you could redirect to a confirmation page
    // navigate('/confirmation', { state: { movie, session, selectedSeats, bookingData } });
  };

  // If movie data is still loading
  if (!movie || !session) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking information...</p>
      </div>
    );
  }

  return (
    <div className="seat-booking-container">
      <div className="movie-info-banner">
        <div className="movie-info-poster">
          <img src={movie.posterUrl} alt={movie.title} />
        </div>
        <div className="movie-info-details">
          <h2>{movie.title}</h2>
          <div className="session-info">
            <span className="session-date">{formatDate(session.date)}</span>
            <span className="session-time">{session.time}</span>
            <span className="session-hall">Hall {session.hall || 1}</span>
          </div>
        </div>
      </div>
      
      <div className="seat-selection-container">
        <div className="seat-selection-instructions">
          Please select your seats from the available options below.
          <br />
          VIP seats include extra legroom and complimentary refreshments.
        </div>
        
        <div className="screen-container">
          <div className="screen"></div>
          <div className="screen-label">SCREEN</div>
        </div>
        
        <div className="seat-map">
          {seatRows.map(row => (
            <div className="seat-row" key={row.row}>
              <div className="row-label">{row.row}</div>
              <div className="seats">
                {row.seats.map(seat => {
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  const seatClass = `seat ${seat.status} ${seat.type === 'vip' ? 'vip' : ''} ${isSelected ? 'selected' : ''}`;
                  
                  return (
                    <div 
                      className={seatClass} 
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                    >
                      <span className="seat-number">
                        {seat.id.substring(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="seat booked"></div>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <div className="seat available vip"></div>
            <span>VIP</span>
          </div>
        </div>
      </div>
      
      <div className="booking-summary">
        <h3>Booking Summary</h3>
        
        <div className="summary-details">
          {bookingData.standardSeats > 0 && (
            <div className="summary-item">
              <span>Standard Seats × {bookingData.standardSeats}</span>
              <span>${(bookingData.standardSeats * bookingData.standardPrice).toFixed(2)}</span>
            </div>
          )}
          
          {bookingData.vipSeats > 0 && (
            <div className="summary-item">
              <span>VIP Seats × {bookingData.vipSeats}</span>
              <span>${(bookingData.vipSeats * bookingData.vipPrice).toFixed(2)}</span>
            </div>
          )}
          
          {selectedSeats.length > 0 && (
            <div className="summary-item">
              <span>Booking Fee</span>
              <span>${bookingData.bookingFee.toFixed(2)}</span>
            </div>
          )}
          
          <div className="summary-item total">
            <span>Total</span>
            <span>${bookingData.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="booking-actions">
          <button 
            className="btn btn-secondary" 
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className={`btn btn-primary ${selectedSeats.length === 0 ? 'disabled' : ''}`}
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;