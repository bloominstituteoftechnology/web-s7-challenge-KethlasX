import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Form from './Form'

function App() {
  return (
    <div id="app">
      <nav>
        <NavLink to="/" exact>
          Home
        </NavLink>
        <NavLink to="/order">
          Order
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/order' element={<Form />} />
      </Routes>
      <Home />
      <Form />
    </div>
  )
}

export default App
