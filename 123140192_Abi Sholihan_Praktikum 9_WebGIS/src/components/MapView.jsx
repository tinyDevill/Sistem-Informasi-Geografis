import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import api from '../services/api'

export default function MapView() {
  const [data, setData] = useState([])
  const [selectedPos, setSelectedPos] = useState(null)
  const [nama, setNama] = useState('')
  const [jenis, setJenis] = useState('')
  const [alamat, setAlamat] = useState('')

  const fetchData = async () => {
    const res = await api.get('/api/fasilitas')
    setData(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // DELETE
  async function deleteData(id) {
    await api.delete(`/api/fasilitas/${id}`)
    fetchData()
  }

  // UPDATE
  async function updateData(id) {
    await api.put(`/api/fasilitas/${id}`, {
      nama: "Updated dari React"
    })
    fetchData()
  }

  // CREATE
  async function addData() {
    if (!selectedPos) {
      alert("Klik peta dulu untuk pilih lokasi!")
      return
    }

    await api.post('/api/fasilitas', {
      nama,
      jenis,
      alamat,
      longitude: selectedPos.lng,
      latitude: selectedPos.lat
    })

    if (!nama || !jenis || !alamat) {
      alert("Semua field harus diisi!")
      return
    }

    // reset
    setNama('')
    setJenis('')
    setAlamat('')
    setSelectedPos(null)

    fetchData()
  }

  function MapClickHandler({ setSelectedPos }) {
    useMapEvents({
      click(e) {
        setSelectedPos(e.latlng)
      }
    })
    return null
  }

  const styles = {
    sidebar: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      background: '#ffffff',
      padding: '20px',
      borderRadius: '12px',
      width: '300px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
    },
    input: {
      width: '91%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc'
    },
    button: {
      width: '100%',
      padding: '10px',
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    coord: {
      fontSize: '12px',
      marginBottom: '10px',
      color: '#555'
    }
  }

  return (
    <div>
      {/* tombol tambah global */}
      <h1>Praktikum 9 SIG Abi Sholihan [123140192]</h1>
      <div style={styles.sidebar}>
        <h3>Tambah Fasilitas</h3>

        <input
          style={styles.input}
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Jenis"
          value={jenis}
          onChange={(e) => setJenis(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Alamat"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
        />

        {selectedPos ? (
          <p style={styles.coord}>
            📍 {selectedPos.lat.toFixed(5)}, {selectedPos.lng.toFixed(5)}
          </p>
        ) : (
          <p style={styles.coord}>Klik peta untuk pilih lokasi</p>
        )}

        <button style={styles.button} onClick={addData}>
          Simpan
        </button>
      </div>

      <MapContainer center={[-5.4, 105.25]} zoom={13} style={{height: "100vh"}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler setSelectedPos={setSelectedPos} />
        {selectedPos && (
          <Marker position={[selectedPos.lat, selectedPos.lng]}>
            <Popup>Lokasi baru</Popup>
          </Marker>
        )}
        
          {data.map((item) => {
            try {
              const geom = JSON.parse(item.geom)
              const [lon, lat] = geom.coordinates
              
              return (
                <Marker key={item.id} position={[lat, lon]}>
                  <Popup>
                    <b>{item.nama}</b><br/>
                    {item.jenis}
                    {item.alamat}
                  </Popup>
                </Marker>
              )
            } catch (err) {
              console.log("Error parsing geom:", item)
              return null
            }
          })}
      </MapContainer>
    </div>
  )
}