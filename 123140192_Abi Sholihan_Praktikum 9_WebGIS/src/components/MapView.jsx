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
  const [editId, setEditId] = useState(null)

  const fetchData = async () => {
    const res = await api.get('/api/fasilitas')
    setData(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // RESET FORM
  function resetForm() {
    setNama('')
    setJenis('')
    setAlamat('')
    setSelectedPos(null)
    setEditId(null)
  }

  // DELETE
  async function deleteData() {
    if (!confirm("Yakin hapus data ini?")) return

    await api.delete(`/api/fasilitas/${editId}`)

    resetForm()
    fetchData()
  }

  // UPDATE
  async function updateData() {
    try {
      if (!nama || !jenis || !alamat) {
        alert("Semua field harus diisi!")
        return
      }

      await api.put(`/api/fasilitas/${editId}`, {
        nama,
        jenis,
        alamat
      })

      resetForm()
      fetchData()

    } catch (err) {
      console.error(err)
      alert("Gagal update data!")
    }
  }

  // CREATE
  async function addData() {
    if (!selectedPos) {
      alert("Klik peta dulu untuk pilih lokasi!")
      return
    }

    if (!nama || !jenis || !alamat) {
      alert("Semua field harus diisi!")
      return
    }

    await api.post('/api/fasilitas', {
      nama,
      jenis,
      alamat,
      longitude: selectedPos.lng,
      latitude: selectedPos.lat
    })

    // reset
    setNama('')
    setJenis('')
    setAlamat('')
    setSelectedPos(null)

    fetchData()
  }

  function MapClickHandler({ setSelectedPos, resetForm }) {
    useMapEvents({
      click(e) {
        resetForm() // keluar dari edit mode dan mengkosongkan form
        setSelectedPos(e.latlng) // set posisi baru
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
    title: {
      color: editId ? 'orange' : 'green',
      marginTop: '5px'
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
    },
    deleteButton: {
      width: '100%',
      padding: '10px',
      background: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      marginTop: '10px'
    }
  }

  return (
    <div>
      {/* tombol tambah global */}
      <h1>Praktikum 9 SIG Abi Sholihan [123140192]</h1>
      <div style={styles.sidebar}>
        <h3 style={styles.title}>{editId ? "Edit Fasilitas" : "Tambah Fasilitas"}</h3>

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

        <button style={styles.button} onClick={editId ? updateData : addData}>
          {editId ? "Update" : "Simpan"}
        </button>
        
        {editId && (
        <button style={styles.deleteButton} onClick={deleteData}>
            Hapus
          </button>
        )}
      </div>

      <MapContainer center={[-5.4, 105.25]} zoom={13} style={{height: "100vh"}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler 
          setSelectedPos={setSelectedPos} 
          resetForm={resetForm} 
        />
        {selectedPos && (
          <Marker position={[selectedPos.lat, selectedPos.lng]}>
            <Popup>Lokasi baru</Popup>
          </Marker>
        )}        
          {data.map((item) => {
            const geom = JSON.parse(item.geom)
            const [lon, lat] = geom.coordinates

            return (
              <Marker
                key={item.id}
                position={[lat, lon]}
                eventHandlers={{
                  click: () => {
                    setNama(item.nama)
                    setJenis(item.jenis)
                    setAlamat(item.alamat)
                    setSelectedPos({ lat, lng: lon })
                    setEditId(item.id)
                  }
                }}
              >
                <Popup>
                  <b>{item.nama}</b><br/>
                  {item.jenis}
                </Popup>
              </Marker>
            )
          })}
      </MapContainer>
    </div>
  )
}