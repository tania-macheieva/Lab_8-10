import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { movies } from "../data/movies";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CinemaHall from "../components/CinemaHall";
import BookingForm from "../components/BookingForm";
import BookingService from "../services/BookingService";
import "../css/SeatBooking.css";

const SeatBooking = () => {
	const { movieId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(location.state?.movie || null);
	const [session, setSession] = useState(location.state?.session || null);
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [bookingData, setBookingData] = useState({
		standardSeats: 0,
		vipSeats: 0,
		standardPrice: 150,
		vipPrice: 250,
		bookingFee: 20,
		total: 0,
	});
	const [showBookingForm, setShowBookingForm] = useState(false);

	useEffect(() => {
		if (!movie && movieId) {
			const foundMovie = movies.find(
				m =>
					m.id === parseInt(movieId) ||
					m.id === movieId ||
					m.id.toString() === movieId.toString()
			);

			if (foundMovie) {
				setMovie(foundMovie);
				if (
					!session &&
					foundMovie.schedule &&
					foundMovie.schedule.length > 0
				) {
					setSession(foundMovie.schedule[0]);
				}
			} else {
				navigate("/");
			}
		}
	}, [movieId, movie, session, navigate]);

	const seatRows = [
		{
			row: "A",
			seats: [
				{ id: "A1", status: "available" },
				{ id: "A2", status: "available" },
				{ id: "A3", status: "available" },
				{ id: "A4", status: "available" },
				{ id: "A5", status: "available" },
				{ id: "A6", status: "available" },
				{ id: "A7", status: "available" },
				{ id: "A8", status: "available" },
			],
		},
		{
			row: "B",
			seats: [
				{ id: "B1", status: "available" },
				{ id: "B2", status: "available" },
				{ id: "B3", status: "available" },
				{ id: "B4", status: "available" },
				{ id: "B5", status: "available" },
				{ id: "B6", status: "available" },
				{ id: "B7", status: "available" },
				{ id: "B8", status: "available" },
			],
		},
		{
			row: "C",
			seats: [
				{ id: "C1", status: "available" },
				{ id: "C2", status: "available" },
				{ id: "C3", status: "available" },
				{ id: "C4", status: "available" },
				{ id: "C5", status: "available" },
				{ id: "C6", status: "available" },
				{ id: "C7", status: "available" },
				{ id: "C8", status: "available" },
			],
		},
		{
			row: "D",
			seats: [
				{ id: "D1", status: "available", type: "vip" },
				{ id: "D2", status: "available", type: "vip" },
				{ id: "D3", status: "available", type: "vip" },
				{ id: "D4", status: "available", type: "vip" },
				{ id: "D5", status: "available", type: "vip" },
				{ id: "D6", status: "available", type: "vip" },
				{ id: "D7", status: "available", type: "vip" },
				{ id: "D8", status: "available", type: "vip" },
			],
		},
		{
			row: "E",
			seats: [
				{ id: "E1", status: "available", type: "vip" },
				{ id: "E2", status: "available", type: "vip" },
				{ id: "E3", status: "available", type: "vip" },
				{ id: "E4", status: "available", type: "vip" },
				{ id: "E5", status: "available", type: "vip" },
				{ id: "E6", status: "available", type: "vip" },
				{ id: "E7", status: "available", type: "vip" },
				{ id: "E8", status: "available", type: "vip" },
			],
		},
	];

	const formatDate = dateString => {
		if (!dateString) return "";
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				weekday: "long",
				month: "long",
				day: "numeric",
			});
		} catch (error) {
			console.error("Error formatting date:", error);
			return dateString;
		}
	};

	const handleSeatClick = seat => {
		if (seat.status === "booked") return;

		const seatIndex = selectedSeats.findIndex(s => s.id === seat.id);

		let updatedSeats;
		if (seatIndex !== -1) {
			updatedSeats = [...selectedSeats];
			updatedSeats.splice(seatIndex, 1);
		} else {
			updatedSeats = [...selectedSeats, seat];
		}

		setSelectedSeats(updatedSeats);
	};

	useEffect(() => {
		const standardSeats = selectedSeats.filter(
			seat => !seat.type || seat.type !== "vip"
		).length;
		const vipSeats = selectedSeats.filter(
			seat => seat.type === "vip"
		).length;

		const standardTotal = standardSeats * bookingData.standardPrice;
		const vipTotal = vipSeats * bookingData.vipPrice;
		const bookingFee =
			selectedSeats.length > 0 ? bookingData.bookingFee : 0;
		const total = standardTotal + vipTotal + bookingFee;

		setBookingData(prev => ({
			...prev,
			standardSeats,
			vipSeats,
			total,
		}));
	}, [
		selectedSeats,
		bookingData.standardPrice,
		bookingData.vipPrice,
		bookingData.bookingFee,
	]);

	const handleCancel = () => {
		navigate("/");
	};

	const handleProceedToPayment = () => {
		if (selectedSeats.length === 0) return;
		setShowBookingForm(true);
	};
	
	const handleCancelBooking = () => {
		setShowBookingForm(false);
	};
	
	const handleSubmitBooking = (customerInfo) => {
		const bookingData = {
			movieId: movie.id,
			sessionDate: session.date,
			sessionTime: session.time,
			seats: selectedSeats,
			customerInfo
		};
		
		const result = BookingService.createBooking(bookingData);
		
		if (result.success) {
			toast.success("Бронювання успішно створено!", {
				position: "top-center",
				autoClose: 5000
			});
			
			setShowBookingForm(false);
			
			setSelectedSeats([]);
			
			window.location.reload();
		} else {
			toast.error(result.message || "Помилка при створенні бронювання", {
				position: "top-center",
				autoClose: 5000
			});
		}
	};

	if (!movie || !session) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<p>Завантаження інформації про бронювання...</p>
			</div>
		);
	}

	return (
		<div className="seat-booking-container">
			<div className="movie-info-banner">
				<div className="movie-info-poster">
					<img
						src={movie.posterUrl || "/api/placeholder/120/180"}
						alt={movie.title}
						onError={e => {
							e.target.src = "/api/placeholder/120/180";
						}}
					/>
				</div>
				<div className="movie-info-details">
					<h2>{movie.title}</h2>
					<div className="session-info">
						<span className="session-date">
							{formatDate(session.date)}
						</span>
						<span className="session-time">{session.time}</span>
						<span className="session-hall">
							Зал {session.hall || 1}
						</span>
					</div>
				</div>
			</div>

			<CinemaHall 
				seatRows={seatRows} 
				selectedSeats={selectedSeats} 
				onSeatClick={handleSeatClick}
				movieId={movie.id}
				session={session}
			/>

			<div className="booking-summary">
				<h3>Підсумок бронювання</h3>

				<div className="summary-details">
					{bookingData.standardSeats > 0 && (
						<div className="summary-item">
							<span>
								Стандартні місця {bookingData.standardSeats}
							</span>
							<span>
								₴
								{(
									bookingData.standardSeats *
									bookingData.standardPrice
								).toFixed(2)}
							</span>
						</div>
					)}

					{bookingData.vipSeats > 0 && (
						<div className="summary-item">
							<span>VIP місця {bookingData.vipSeats}</span>
							<span>
								₴
								{(
									bookingData.vipSeats * bookingData.vipPrice
								).toFixed(2)}
							</span>
						</div>
					)}

					{selectedSeats.length > 0 && (
						<div className="summary-item">
							<span>Комісія</span>
							<span>₴{bookingData.bookingFee.toFixed(2)}</span>
						</div>
					)}

					<div className="summary-item total">
						<span>Всього</span>
						<span>₴{bookingData.total.toFixed(2)}</span>
					</div>
				</div>

				<div className="booking-actions">
					<button
						className="btn btn-secondary"
						onClick={handleCancel}
					>
						Скасувати
					</button>
					<button
						className={`btn btn-primary ${
							selectedSeats.length === 0 ? "disabled" : ""
						}`}
						onClick={handleProceedToPayment}
						disabled={selectedSeats.length === 0}
					>
						Забронювати
					</button>
				</div>
			</div>
			
			{/* Форма бронювання */}
			{showBookingForm && (
				<BookingForm 
					onSubmit={handleSubmitBooking}
					onCancel={handleCancelBooking}
					totalAmount={bookingData.total}
					selectedSeats={selectedSeats}
				/>
			)}
			
			{/* Контейнер для сповіщень */}
			<ToastContainer />
		</div>
	);
};

export default SeatBooking;