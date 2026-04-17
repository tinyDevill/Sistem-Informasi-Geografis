import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'

function MapView() {
  const [data, setData] = useState(null)

  const onEachFeature = (feature, layer) => {
    const { nama, jenis } = feature.properties
    const [lon, lat] = feature.geometry.coordinates

    layer.bindPopup(`
      <div>
      <h3>${nama}</h3>
      <p><b>Jenis:</b> ${jenis}</p>
      <p><b>Koordinat:</b> ${lat.toFixed(5)}, ${lon.toFixed(5)}</p>
      </div>
    `)

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ radius: 12 })
      },
      mouseout: (e) => {
        e.target.setStyle({ radius: 8 })
      },
      click: (e) => {
        const map = e.target._map
        map.flyTo(e.latlng, 16, { duration: 1 })
      }
    })
  }

  const pointToLayer = (feature, latlng) => {
    const jenis = feature.properties.jenis

    let color = 'gray'

    if (jenis === 'Rumah Sakit') color = 'red'
    else if (jenis === 'Sekolah') color = 'blue'
    else if (jenis === 'Apotek') color = 'green'
    else if (jenis === 'Puskesmas') color = 'orange'

    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: color,
      color: '#000',
      weight: 1,
      fillOpacity: 0.8
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/fasilitas/geojson')
        setData(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <MapContainer
      center={[-5.42, 105.26]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {data && (
        <GeoJSON 
          data={data}
          onEachFeature={onEachFeature}
          pointToLayer={pointToLayer}
        />
      )}
    </MapContainer>
  )
}

export default MapView