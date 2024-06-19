import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

// Validation errors using Yup
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  sizeIncorrect: 'size must be S or M or L'
};

// Validation schema
const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .required(),
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
  const [orderDetails, setOrderDetails] = useState(null);
  const pizzaSizes = { s: "small", m: "medium", l: "large" }

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    Yup
    .reach(validationSchema, name)
    .validate(value)
    .then(() => {
      // If value is valid, the corresponding error message will be deleted
      setErrors({ ...errors, [name]: "" });
    })
    .catch((err) => {
      // If invalid, we update the error message with the text returned by Yup
      // This error message was hard-coded in the schema
      setErrors({ ...errors, [name]: err.errors[0] });
    });
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

  useEffect(() => {
    validationSchema.isValid(formData).then((isValid) => {
      setIsValid(isValid);
    });
  }, [formData]);

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
      setErrors({}); // Clear any existing errors
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submitted && orderDetails && (
        <div className='success'>
          Thank you for your order, {orderDetails.fullname}!<br />
          Your {pizzaSizes[orderDetails.size.toLowerCase()]} pizza
          {orderDetails.toppings === 0
            ? ' with no toppings'
            : ` with ${orderDetails.toppings} toppings. `}
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
            value={formData.fullname.trim()}
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
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
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
      <input type="submit" disabled={!isValid} />
    </form>
  );
}
