import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

// Validation errors using Yup
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
};

// Validation schema
const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Full name is required'),
  size: Yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('Size is required'),
  toppings: Yup.array().of(Yup.string())
});

// Toppings array
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {
  const [formData, setFormData] = useState({
    fullname: '',
    size: '',
    toppings: []
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    validationSchema
      .validate(formData, { abortEarly: false })
      .then(() => setIsValid(true))
      .catch(err => {
        const newErrors = {};
        err.inner.forEach(e => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
        setIsValid(false);
      });
  }, [formData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        toppings: checked
          ? [...prev.toppings, value]
          : prev.toppings.filter(t => t !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isValid) {
      setSubmitted(true);
      setOrderDetails({
        fullname: formData.fullname,
        size: formData.size,
        toppings: formData.toppings.length
      });
      // Clear the form after submission
      setFormData({
        fullname: '',
        size: '',
        toppings: []
      });
      setIsValid(false); // To disable the submit button after form reset
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submitted && (
        <div className='success'>
          Thank you for your order, {orderDetails.fullname}!<br />
          Your {orderDetails.size.toLowerCase()} pizza<br />
          {orderDetails.toppings === 0
            ? 'with no toppings'
            : `with ${orderDetails.toppings} topping${orderDetails.toppings > 1 ? 's' : ''}`}
        </div>
      )}
      {!submitted && !isValid && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            name="fullname"
            type="text"
            value={formData.fullname}
            onChange={handleChange}
          />
        </div>
        {errors.fullname && <div className='error'>{errors.fullname}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={formData.size} onChange={handleChange}>
            <option value="">----Choose Size----</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              name='toppings'
              type='checkbox'
              value={topping.text}
              checked={formData.toppings.includes(topping.text)}
              onChange={handleChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>
      {/* Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!isValid} />
    </form>
  );
}
