import { isValid } from 'ipaddr.js';
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'fullname must be at least 3 characters',
  fullNameTooLong: 'fullname must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
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

// 👇 This array could help you construct your checkboxes using .map in the JSX.
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
  }, [formData])

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
      console.log('Form data:', formData);
    }
  };

  return (
    <form>
      <h2>Order Your Pizza</h2>
      {isValid && <div className='success'>Thank you for your order!</div>}
      {!isValid && <div className='failure'>Something went wrong</div>}

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
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
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
      {/* 👇 Make sure the submit stays disabled until the form validates! */ }
  <input type="submit" disabled={!isValid}/>
    </form >
  );
}
