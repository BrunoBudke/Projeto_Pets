import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../../../context/UserContext'
import '../../Home/Home.css'

function Login() {
  const { login } = useContext(Context)
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await login(form)
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-logo"> Get A Pet</Link>
        <h1>Bem-vindo de volta!</h1>
        <p className="auth-subtitle">Entre com sua conta para adotar um pet</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email"
              placeholder="seu@email.com" value={form.email}
              onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password"
              placeholder="Sua senha" value={form.password}
              onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-footer">
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
      <div className="auth-visual">
        
        <h2>Seu novo amigo espera por você</h2>
        <p>Milhares de pets prontos para encontrar um lar cheio de amor.</p>
      </div>
    </div>
  )
}

export default Login
