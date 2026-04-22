import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import MapView from './components/MapView'

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          token ? <MapView /> : <Login />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App