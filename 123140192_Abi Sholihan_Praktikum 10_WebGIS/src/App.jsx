import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MapView from './components/MapView'

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <MapView /> : <Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
