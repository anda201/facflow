import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Plans from './pages/Plans'
import Productions from './pages/Productions'
import Equipments from './pages/Equipments'
import { Navbar } from './components/common'

function App() {
  return (
    <div className='layout d-flex flex-column min-vh-100'>
      <Navbar />
      <section id="center" className='flex-1'>
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/productions" element={<Productions />} />
            <Route path="/equipments" element={<Equipments />} />
          </Routes>
        </div>
      </section>
    </div>
  )
}

export default App
