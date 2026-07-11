import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Plans from './pages/Plans'
import Productions from './pages/Productions'
import Equipments from './pages/Equipments'
import Defects from './pages/Defects'
import Navbar from './components/common/Navbar'

function App() {
  return (
    <div className='layout d-flex flex-column min-vh-100'>
      <Navbar />
      <section id="center" className='flex-1'>
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/productions" element={<Productions />} />
            <Route path="/equipments" element={<Equipments />} />
            <Route path="/defects" element={<Defects />} />
          </Routes>
        </div>
      </section>
    </div>
  )
}

export default App
