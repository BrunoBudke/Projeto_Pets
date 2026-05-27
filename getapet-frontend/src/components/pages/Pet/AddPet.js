import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../../../context/UserContext'
import Navbar from '../../layout/Navbar'
import api from '../../../utils/api'
import useFlashMessage from '../../../hooks/useFlashMessage'
import './AddPet.css'

export default function AddPet() {
  const { authenticated } = useContext(Context)
  const navigate = useNavigate()
  const { setFlashMessage } = useFlashMessage()

  const [form, setForm]       = useState({ name:'', breed:'', age:'', weight:'', color:'', description:'' })
  const [images, setImages]   = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)

  if (!authenticated) return (
    <div className="addpet-page">
      <Navbar />
      <div className="addpet-no-auth">
        <span></span>
        <h2>Acesso restrito</h2>
        <p>Você precisa estar logado para cadastrar um pet.</p>
        <Link to="/login">Fazer login →</Link>
      </div>
    </div>
  )

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleImages(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { name, breed, age, weight, color } = form
    if (!name || !breed || !age || !weight || !color) {
      setFlashMessage('Preencha todos os campos obrigatórios.', 'error')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v) })
      images.forEach(img => formData.append('images', img))

      await api.post('/pets', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setFlashMessage('Pet cadastrado com sucesso! ', 'success')
      navigate('/mypets')
    } catch (err) {
      setFlashMessage(err.response?.data?.message || 'Erro ao cadastrar pet.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="addpet-page">
      <Navbar />
      <main className="addpet-main">
        <div className="addpet-header">
          <h1> Cadastrar Pet</h1>
          <p>Preencha as informações do pet para colocá-lo disponível para adoção.</p>
        </div>

        <div className="addpet-card">
          <form className="addpet-form" onSubmit={handleSubmit}>

            {/* Imagens */}
            <div className="addpet-field">
              <label>Fotos do pet <span style={{ color:'#bbb', fontWeight:600 }}>(opcional, até 10)</span></label>
              <label htmlFor="petImages" className="addpet-upload-area">
                
                <span className="addpet-upload-text">Clique para adicionar fotos</span>
                <span className="addpet-upload-sub">JPG, PNG ou WEBP · máx. 5 MB cada</span>
              </label>
              <input type="file" id="petImages" multiple accept="image/*"
                onChange={handleImages} style={{ display:'none' }} />
              {previews.length > 0 && (
                <div className="addpet-previews">
                  {previews.map((src, i) => (
                    <img key={i} src={src} alt={`preview ${i+1}`} className="addpet-preview-img" />
                  ))}
                </div>
              )}
            </div>

            {/* Nome + Raça */}
            <div className="addpet-row">
              <div className="addpet-field">
                <label>Nome *</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Ex: Rex" required />
              </div>
              <div className="addpet-field">
                <label>Raça *</label>
                <input name="breed" value={form.breed} onChange={handleChange}
                  placeholder="Ex: Labrador" required />
              </div>
            </div>

            {/* Idade + Peso + Cor */}
            <div className="addpet-row">
              <div className="addpet-field">
                <label>Idade *</label>
                <input name="age" value={form.age} onChange={handleChange}
                  placeholder="Ex: 2 anos" required />
              </div>
              <div className="addpet-field">
                <label>Peso *</label>
                <input name="weight" value={form.weight} onChange={handleChange}
                  placeholder="Ex: 15 kg" required />
              </div>
            </div>

            <div className="addpet-field">
              <label>Cor *</label>
              <input name="color" value={form.color} onChange={handleChange}
                placeholder="Ex: Dourado, Branco e marrom..." required />
            </div>

            {/* Descrição */}
            <div className="addpet-field">
              <label>Descrição <span style={{ color:'#bbb', fontWeight:600 }}>(opcional)</span></label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Conte sobre a personalidade, hábitos e história do pet..."
                rows={4} />
            </div>

            <button type="submit" className="addpet-submit" disabled={loading}>
              {loading ? ' Cadastrando...' : ' Cadastrar Pet'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
