import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';import Modal from './Modal';
import '../css/MovieCard.css';

const MovieCard = ({ movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleBookSession = (session) => {
    setIsModalOpen(false);
    
    navigate(`/booking/${movie.id}`, { 
      state: { movie, session } 
    });
  };

  return (
    <>
      <div className="movie-card">
        <div className="movie-poster">
          <img src={movie.posterUrl} alt={movie.title} />
        </div>
        <div className="movie-details">
          <h2 className="movie-title">{movie.title}</h2>
          
          <div className="movie-meta">
            <span className="movie-genre">{movie.genre}</span>
            <div className="movie-rating">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
              {movie.rating ? movie.rating : (Math.random() * 2 + 3).toFixed(1)}/5
            </div>
          </div>
          
          <p className="movie-description">{movie.description}</p>
          
          <div className="movie-schedule">
            <h3>Showtimes</h3>
            <div className="sessions-container">
              {movie.schedule.slice(0, 2).map((session, index) => (
                <div className="session-chip" key={index}>
                  <span className="session-date">{formatDate(session.date)}</span>
                  <span className="session-time">{session.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="movie-actions">
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Book Tickets</button>
            <button className="btn btn-secondary">Watch Trailer</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="movie-detail-modal">
          <div className="movie-modal-header">
            <img 
              src={movie.backdropUrl || movie.posterUrl} 
              alt={movie.title} 
              className="movie-modal-backdrop" 
            />
            <div className="movie-modal-header-overlay">
              <div className="movie-modal-poster">
                <img src={movie.posterUrl} alt={movie.title} />
              </div>
              <div className="movie-modal-header-info">
                <h2>{movie.title}</h2>
                <div className="movie-modal-meta">
                  <div className="movie-modal-detail">
                    <span>{movie.genre}</span>
                  </div>
                  <div className="movie-modal-detail">
                    <span>{movie.duration || '120 min'}</span>
                  </div>
                  <div className="movie-modal-detail">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '5px'}}>
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    <span>{movie.rating ? movie.rating : (Math.random() * 2 + 3).toFixed(1)}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="movie-modal-body">
            <div className="movie-modal-section">
              <h3>Synopsis</h3>
              <p className="movie-modal-description">{movie.description}</p>
            </div>
            
            <div className="movie-modal-section">
              <h3>Available Sessions</h3>
              <div className="session-grid">
                {movie.schedule.map((session, index) => (
                  <div 
                    className="session-card" 
                    key={index}
                    onClick={() => handleBookSession(session)}
                  >
                    <div className="session-card-date">{formatFullDate(session.date)}</div>
                    <div className="session-card-time">{session.time}</div>
                    <div className="session-card-hall">Hall {session.hall || index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MovieCard;