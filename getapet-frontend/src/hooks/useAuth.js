import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import useFlashMessage from './useFlashMessage'

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser]                   = useState(null)
  const [loading, setLoading]             = useState(true)
  const navigate = useNavigate()
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    const raw = localStorage.getItem('token')
    if (raw) {
      setAuthenticated(true)
      api.get('/users/profile')
        .then(({ data }) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('token')
          setAuthenticated(false)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function register(userData) {
    try {
      const formData = new FormData()
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value)
        }
      })
      const { data } = await api.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setFlashMessage(data.message || 'Cadastro realizado com sucesso!', 'success')
      navigate('/login')
    } catch (err) {
      setFlashMessage(err.response?.data?.message || 'Erro ao realizar cadastro.', 'error')
    }
  }

  async function login(credentials) {
    try {
      const { data } = await api.post('/users/login', credentials)
      localStorage.setItem('token', JSON.stringify(data.token))
      setAuthenticated(true)
      setUser(data.user)
      setFlashMessage(data.message || 'Login realizado com sucesso!', 'success')
      navigate('/')
    } catch (err) {
      setFlashMessage(err.response?.data?.message || 'Credenciais inválidas.', 'error')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setAuthenticated(false)
    setUser(null)
    setFlashMessage('Logout realizado com sucesso!', 'success')
    navigate('/')
  }

  return { authenticated, user, loading, register, logout, login }
}
