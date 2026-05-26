import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../../../context/UserContext'
import '../../Home/Home.css'
import './Auth.css'

function Register() {
  const { register } = useContext(Context)
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '' })
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await register({ ...form, image })
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-logo"> Get A Pet</Link>
        <h1>Crie sua conta</h1>
        <p className="auth-subtitle">Cadastre-se e comece a adotar</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Foto de perfil <span style={{ color: '#bbb', fontWeight: 600 }}>(opcional)</span></label>
            <label htmlFor="image" className="upload-label">
              {preview
                ? <img src={preview} alt="preview" className="upload-preview" />
                : <span className="upload-placeholder"> Escolher foto</span>}
            </label>
            <input type="file" id="image" accept="image/*"
              onChange={handleImage} style={{ display: 'none' }} />
          </div>
          <div className="form-group">
            <label htmlFor="name">Nome completo</label>
            <input type="text" id="name" name="name"
              placeholder="João Silva" value={form.name}
              onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email"
              placeholder="seu@email.com" value={form.email}
              onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone <span style={{ color: '#bbb', fontWeight: 600 }}>(opcional)</span></label>
            <input type="tel" id="phone" name="phone"
              placeholder="(48) 99999-9999" value={form.phone}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password"
              placeholder="Mínimo 6 caracteres" value={form.password}
              onChange={handleChange} required minLength={6} />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
      <div className="auth-visual">
        <div className="auth"></div>
        <h2>Seja bem-vindo à família</h2>
        <p>Cadastre-se e encontre o companheiro perfeito para a sua vida.</p>
      </div>
    </div>
  )
}

export default Register
