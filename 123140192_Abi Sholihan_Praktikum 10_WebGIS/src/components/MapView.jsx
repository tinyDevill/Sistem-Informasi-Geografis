import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleMarker, ImageOverlay, MapContainer, Popup, useMap } from 'react-leaflet'
import * as L from 'leaflet'

function FitBounds({ bounds }) {
  const map = useMap()

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [24, 24] })
    }
  }, [bounds, map])

  return null
}

export default function DetectionView() {
  const [geojsonUrl, setGeojsonUrl] = useState('/detections.geojson')
  const [imageUrl, setImageUrl] = useState('/Test.png')
  const [inputGeojsonUrl, setInputGeojsonUrl] = useState('/detections.geojson')
  const [inputImageUrl, setInputImageUrl] = useState('/Test.png')
  const [geojson, setGeojson] = useState(null)
  const [imageSize, setImageSize] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadImageSize = async () => {
      if (!imageUrl) {
        setImageSize(null)
        return
      }

      const img = new window.Image()
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = () => {
        setImageSize(null)
      }
      img.src = imageUrl
    }

    loadImageSize()
  }, [imageUrl])

  useEffect(() => {
    const loadGeojson = async () => {
      if (!geojsonUrl) {
        setGeojson(null)
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await fetch(geojsonUrl)
        if (!res.ok) {
          throw new Error(`Gagal memuat ${geojsonUrl} (${res.status})`)
        }
        const data = await res.json()
        setGeojson(data)
      } catch (err) {
        setGeojson(null)
        setError(err.message || 'Gagal memuat GeoJSON')
      } finally {
        setLoading(false)
      }
    }

    loadGeojson()
  }, [geojsonUrl])

  const features = useMemo(() => {
    return geojson?.features?.filter((feature) => feature?.geometry?.type === 'Point') ?? []
  }, [geojson])

  const bounds = useMemo(() => {
    if (imageSize?.width && imageSize?.height) {
      return [[0, 0], [imageSize.height, imageSize.width]]
    }

    if (features.length > 0) {
      const coords = features
        .map((f) => f.geometry.coordinates)
        .filter((coords) => Array.isArray(coords) && coords.length >= 2)

      if (coords.length > 0) {
        const maxX = Math.max(...coords.map((c) => Number(c[0]) || 0))
        const maxY = Math.max(...coords.map((c) => Number(c[1]) || 0))
        const pad = 100
        return [[0, 0], [Math.max(maxY + pad, 1000), Math.max(maxX + pad, 1000)]]
      }
    }

    return [[0, 0], [1000, 1000]]
  }, [features, imageSize])

  const shell = {
    minHeight: '100vh',
    width: '100vw',
    background: '#050505',
    position: 'relative',
    overflow: 'hidden'
  }

  const panel = {
    position: 'absolute',
    top: '18px',
    left: '18px',
    zIndex: 1000,
    width: '360px',
    background: 'rgba(15, 15, 17, 0.92)',
    backdropFilter: 'blur(14px)',
    borderRadius: '18px',
    padding: '18px',
    boxShadow: '0 24px 50px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f5f5f5'
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 12px',
    marginTop: '8px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: '#0b0b0d',
    color: '#f5f5f5',
    fontSize: '14px',
    boxSizing: 'border-box'
  }

  const buttonStyle = {
    width: '100%',
    marginTop: '12px',
    padding: '11px 12px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer'
  }

  const ghostButton = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #111827, #374151)'
  }

  const title = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1000,
    fontSize: '50px'
  }

  return (
    <div>
      <h1 style={title}>Praktikum 10 SIG Abi Sholihan [123140192]</h1>
      <div style={shell}>
        <MapContainer
          crs={L.CRS.Simple}
          center={[0, 0]}
          zoom={0}
          minZoom={-2}
          maxZoom={4}
          style={{ height: '100vh', width: '100%', background: '#050505' }}
        >
          <FitBounds bounds={bounds} />
          {imageUrl && <ImageOverlay url={imageUrl} bounds={bounds} />}

          {features.map((feature, index) => {
            const coords = feature.geometry.coordinates || []
            const x = Number(coords[0]) || 0
            const y = Number(coords[1]) || 0
            const props = feature.properties || {}
            const label = props.class || props.class_name || 'object'
            const confidence = typeof props.confidence === 'number' ? props.confidence : null

            return (
              <CircleMarker
                key={`${label}-${index}`}
                center={[y, x]}
                radius={8}
                pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.9, weight: 2 }}
              >
                <Popup>
                  <b>{label}</b>
                  <br />
                  Koordinat pixel: {x.toFixed(1)}, {y.toFixed(1)}
                  {confidence !== null && (
                    <>
                      <br />
                      Confidence: {confidence.toFixed(3)}
                    </>
                  )}
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}
