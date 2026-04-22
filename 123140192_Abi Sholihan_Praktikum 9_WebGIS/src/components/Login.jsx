import { useState } from 'react'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError('')

      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)

      const res = await api.post('/api/auth/login', form)

      localStorage.setItem('token', res.data.access_token)
      window.location.href = '/'

    } catch (err) {
      setError('Email atau password salah!')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f4f6f8'
    },
    card: {
        background: '#fff',
        padding: '30px',
        borderRadius: '12px',
        width: '300px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#000000'
    },
    input: {
        width: '90%',
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
    error: {
        color: 'red',
        fontSize: '14px',
        marginBottom: '10px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login WebGIS</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </div>
    </div>
  )
}