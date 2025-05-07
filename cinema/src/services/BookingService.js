class BookingService {
  constructor() {
    this.BOOKINGS_KEY = 'cinema_bookings';
  }

  // Отримати всі бронювання
  getAllBookings() {
    try {
      const bookings = localStorage.getItem(this.BOOKINGS_KEY);
      return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
      console.error('Error getting bookings from localStorage:', error);
      return [];
    }
  }

  // Отримати бронювання для конкретного фільму
  getBookingsByMovieId(movieId) {
    try {
      const allBookings = this.getAllBookings();
      return allBookings.filter(booking => booking.movieId.toString() === movieId.toString());
    } catch (error) {
      console.error(`Error getting bookings for movie ${movieId}:`, error);
      return [];
    }
  }

  // Отримати заброньовані місця для конкретного фільму і сеансу
  getBookedSeatsForSession(movieId, sessionDate, sessionTime) {
    try {
      const movieBookings = this.getBookingsByMovieId(movieId);
      const sessionBookings = movieBookings.filter(
        booking => 
          booking.sessionDate === sessionDate && 
          booking.sessionTime === sessionTime
      );
      
      // Збираємо всі заброньовані місця
      let bookedSeats = [];
      sessionBookings.forEach(booking => {
        bookedSeats = [...bookedSeats, ...booking.seats];
      });
      
      return bookedSeats;
    } catch (error) {
      console.error(`Error getting booked seats for movie ${movieId}, session ${sessionDate} ${sessionTime}:`, error);
      return [];
    }
  }

  // Створити нове бронювання
  createBooking(bookingData) {
    try {
      const { movieId, sessionDate, sessionTime, seats, customerInfo } = bookingData;
      
      // Перевірка, чи не заброньовані вже ці місця
      const bookedSeats = this.getBookedSeatsForSession(movieId, sessionDate, sessionTime);
      const alreadyBooked = seats.filter(seat => 
        bookedSeats.some(bookedSeat => bookedSeat.id === seat.id)
      );
      
      if (alreadyBooked.length > 0) {
        return {
          success: false,
          message: `Місце ${alreadyBooked.map(seat => seat.id).join(', ')} вже заброньоване. Оновіть сторінку, щоб отримати актуальну інформацію.`
        };
      }
      
      // Створення нового бронювання
      const booking = {
        id: Date.now().toString(),
        movieId,
        sessionDate,
        sessionTime,
        seats,
        customerInfo,
        createdAt: new Date().toISOString()
      };
      
      // Зберігання бронювання
      const allBookings = this.getAllBookings();
      allBookings.push(booking);
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(allBookings));
      
      return {
        success: true,
        booking
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        message: 'Помилка при збереженні бронювання. Спробуйте знову.'
      };
    }
  }

  // Отримати деталі бронювання за ID
  getBookingById(bookingId) {
    try {
      const allBookings = this.getAllBookings();
      return allBookings.find(booking => booking.id === bookingId) || null;
    } catch (error) {
      console.error(`Error getting booking ${bookingId}:`, error);
      return null;
    }
  }

  // Скасувати бронювання
  cancelBooking(bookingId) {
    try {
      const allBookings = this.getAllBookings();
      const updatedBookings = allBookings.filter(booking => booking.id !== bookingId);
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(updatedBookings));
      
      return {
        success: true,
        message: 'Бронювання скасовано успішно'
      };
    } catch (error) {
      console.error(`Error canceling booking ${bookingId}:`, error);
      return {
        success: false,
        message: 'Помилка при скасуванні бронювання'
      };
    }
  }
}

export default new BookingService();
