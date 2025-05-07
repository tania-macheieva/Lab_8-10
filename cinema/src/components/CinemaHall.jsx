import React, { useState, useEffect } from "react";
import BookingService from "../services/BookingService";

const CinemaHall = ({ seatRows: initialSeatRows, selectedSeats, onSeatClick, movieId, session }) => {
  const [seatRows, setSeatRows] = useState(initialSeatRows);
  const [loading, setLoading] = useState(true);

  // Завантаження заброньованих місць при зміні фільму або сеансу
  useEffect(() => {
    if (movieId && session) {
      setLoading(true);
      
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
      setLoading(false);
    }
  }, [movieId, session, initialSeatRows]);

  return (
    <div className="seat-selection-container">
      {loading ? (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Завантаження схеми залу...</p>
        </div>
      ) : (
        <>
          <div className="seat-selection-instructions">
            Будь ласка, виберіть потрібні місця з доступних варіантів нижче.
            <br />
            VIP-місця мають додатковий простір для ніг та безкоштовні напої.
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
                    aria-label={`Seat ${seat.id}, ${seat.status}${
                      seat.type === "vip" ? ", VIP" : ""
                    }`}
                    role="button"
                    tabIndex={seat.status !== "booked" ? 0 : -1}
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
          <span>Достпні</span>
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
        </>
      )}
    </div>
  );
};

export default CinemaHall;