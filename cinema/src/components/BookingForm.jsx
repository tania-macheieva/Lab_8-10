import React, { useState } from "react";
import "../css/BookingForm.css";

const BookingForm = ({ onSubmit, onCancel, totalAmount, selectedSeats }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Очищаємо помилку при зміні поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      phone: "",
      email: ""
    };

    // Валідація імені
    if (!formData.name.trim()) {
      newErrors.name = "Ім'я обов'язкове";
      valid = false;
    }

    // Валідація телефону
    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обов'язковий";
      valid = false;
    } else if (!/^\+?[0-9]{10,13}$/.test(formData.phone.trim())) {
      newErrors.phone = "Введіть коректний телефон (10-13 цифр)";
      valid = false;
    }

    // Валідація email
    if (!formData.email.trim()) {
      newErrors.email = "Email обов'язковий";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Введіть коректний email";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-container">
        <h2>Завершення бронювання</h2>
        <div className="booking-summary-info">
          <p>Обрано місць: {selectedSeats.length}</p>
          <p>Загальна сума: ₴{totalAmount.toFixed(2)}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="name">Ваше ім'я:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Телефон:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+380XXXXXXXXX"
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="booking-form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Скасувати
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Забронювати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;