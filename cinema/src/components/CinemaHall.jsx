import React, { useState, useEffect } from "react";
import BookingService from "../services/BookingService";

const CinemaHall = ({ seatRows: initialSeatRows, selectedSeats, onSeatClick, movieId, session }) => {
  const [seatRows, setSeatRows] = useState(initialSeatRows);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  // Завантаження заброньованих місць при зміні фільму або сеансу
  useEffect(() => {
    if (movieId && session) {
      setLoading(true);
      setLoadingError(false);
      
      try {
        // Отримуємо всі заброньовані місця для поточного сеансу
        const bookedSeats = BookingService.getBookedSeatsForSession(
          movieId,
          session.date,
          session.time
        );
        
        // Оновлюємо статус місць на основі заброньованих
        const updatedSeatRows = initialSeatRows.map(row => {
          const updatedSeats = row.seats.map(seat => {
            // Перевіряємо, чи місце знаходиться в списку заброньованих
            const isBooked = bookedSeats.some(bookedSeat => bookedSeat.id === seat.id);
            
            if (isBooked && seat.status !== 'booked') {
              return { ...seat, status: 'booked' };
            }
            
            return seat;
          });
          
          return {
            ...row,
            seats: updatedSeats
          };
        });
        
        setSeatRows(updatedSeatRows);
      } catch (error) {
        console.error("Error loading booked seats:", error);
        setLoadingError(true);
      } finally {
        setLoading(false);
      }
    }
  }, [movieId, session, initialSeatRows]);

  // Функція для обчислення ціни місця
  const getSeatPrice = (seat) => {
    return seat.type === "vip" ? "250₴" : "150₴";
  };

  // Візуалізація кількості вибраних місць
  const getSelectedSeatsInfo = () => {
    const standardCount = selectedSeats.filter(seat => !seat.type || seat.type !== "vip").length;
    const vipCount = selectedSeats.filter(seat => seat.type === "vip").length;
    
    if (standardCount === 0 && vipCount === 0) {
      return "Виберіть місця для бронювання";
    }
    
    let info = [];
    if (standardCount > 0) {
      info.push(`${standardCount} стандартних`);
    }
    if (vipCount > 0) {
      info.push(`${vipCount} VIP`);
    }
    
    return `Вибрано: ${info.join(", ")}`;
  };

  return (
    <div className="seat-selection-container">
      {loading ? (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Завантаження схеми залу...</p>
        </div>
      ) : loadingError ? (
        <div className="error-message">
          <p>Помилка завантаження даних залу. Спробуйте оновити сторінку.</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Спробувати знову
          </button>
        </div>
      ) : (
        <>
          <div className="seat-selection-instructions">
            <h3>Вибір місць</h3>
            <p>
              Будь ласка, виберіть потрібні місця з доступних варіантів нижче.
              <br />
              VIP-місця мають додатковий простір для ніг та безкоштовні напої.
            </p>
            <div className="selected-seats-counter">
              {getSelectedSeatsInfo()}
            </div>
          </div>
          
          <div className="screen-container">
            <div className="screen"></div>
            <div className="screen-label">ЕКРАН</div>
          </div>
          
          <div className="seat-map">
            {seatRows.map(row => (
              <div className="seat-row" key={row.row}>
                <div className="row-label">{row.row}</div>
                <div className="seats">
                  {row.seats.map(seat => {
                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                    const seatClass = `seat ${seat.status} ${
                      seat.type === "vip" ? "vip" : ""
                    } ${isSelected ? "selected" : ""}`;
                    return (
                      <div
                        className={seatClass}
                        key={seat.id}
                        onClick={() => onSeatClick(seat)}
                        aria-label={`Місце ${seat.id}, ${
                          seat.status === "available" ? "доступне" : 
                          seat.status === "booked" ? "заброньоване" : "вибране"
                        }${seat.type === "vip" ? ", VIP" : ""}`}
                        role="button"
                        tabIndex={seat.status !== "booked" ? 0 : -1}
                        data-price={getSeatPrice(seat)}
                      >
                        <span className="seat-number">
                          {seat.id.substring(1)}
                        </span>
                        {seat.status !== "booked" && seat.type === "vip" && (
                          <span className="seat-type-icon">★</span>
                        )}
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
              <span>Доступні</span>
            </div>
            <div className="legend-item">
              <div className="seat selected"></div>
              <span>Вибрані</span>
            </div>
            <div className="legend-item">
              <div className="seat booked"></div>
              <span>Заброньовані</span>
            </div>
            <div className="legend-item">
              <div className="seat available vip"></div>
              <span>VIP</span>
            </div>
          </div>
          
          <div className="seat-selection-tips">
            <div className="tip">
              <span className="tip-icon">💡</span>
              <span className="tip-text">Порада: VIP-місця мають комфортніші сидіння та додаткові послуги.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CinemaHall;