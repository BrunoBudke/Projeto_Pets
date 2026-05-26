import { Link, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../../../context/UserContext'
import Navbar from '../../layout/Navbar'
import api from '../../../utils/api'
import './PetProfile.css'

const API_BASE = 'http://localhost:5000'

function PetProfile() {
  const { id } = useParams()
  const { authenticated } = useContext(Context)
  const [pet, setPet]           = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/pets/${id}`)
      .then(({ data }) => setPet(data.pet))
      .catch((err) => { if (err.response?.status === 404) setNotFound(true) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="profile-page"><Navbar />
      <div className="pet-not-found"><span></span><h2>Carregando...</h2></div>
    </div>
  )

  if (notFound || !pet) return (
    <div className="profile-page"><Navbar />
      <div className="pet-not-found">
        <span></span><h2>Pet não encontrado</h2>
        <Link to="/">Voltar para adoção</Link>
      </div>
    </div>
  )

  const imgSrc = pet.images?.length > 0 ? `${API_BASE}/images/pets/${pet.images[0]}` : null

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-main">
        <div className="profile-avatar-wrap">
          {imgSrc ? (
            <img src={imgSrc} alt={pet.name} className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-img"
              style={{ display:'flex', alignItems:'center', justifyContent:'center',
                       background:'linear-gradient(135deg,#f0f4ff,#e8f0fe)', fontSize:'5rem' }}>
              
            </div>
          )}
        </div>

        <div className="profile-card">
          <h1 className="profile-name">{pet.name}</h1>
          <p className="profile-breed">{pet.breed}</p>

          <div className="profile-details">
            <div className="detail-item">
              <p className="detail-label">Peso</p>
              <p className="detail-value">{pet.weight}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Idade</p>
              <p className="detail-value">{pet.age}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Cor</p>
              <p className="detail-value">{pet.color}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Status</p>
              <p className={`detail-value ${pet.available ? 'status-ok' : 'status-no'}`}>
                {pet.available ? ' Disponível' : ' Adotado'}
              </p>
            </div>
          </div>

          {pet.owner && (
            <div className="profile-description" style={{ background:'#f0fff4', borderColor:'#a7f3d0' }}>
              <h3 style={{ color:'#065f46' }}>Tutor responsável</h3>
              <p>
                <strong>{pet.owner.name}</strong>
                {pet.owner.phone && <> ·  {pet.owner.phone}</>}
              </p>
            </div>
          )}

          {pet.description && (
            <div className="profile-description">
              <h3>Sobre {pet.name}</h3>
              <p>{pet.description}</p>
            </div>
          )}

          {pet.available ? (
            authenticated ? (
              <Link to={`/adopt/${pet._id}`} className="btn-adopt-profile">
                 Quero adotar {pet.name}!
              </Link>
            ) : (
              <div className="adopt-cta">
                <p>Faça login para adotar</p>
                <div className="adopt-cta-btns">
                  <Link to="/login"    className="btn-adopt-profile">Entrar</Link>
                  <Link to="/register" className="btn-adopt-outline">Criar conta</Link>
                </div>
              </div>
            )
          ) : (
            <div className="adopted-msg">
              <span></span>
              <p>{pet.name} já encontrou um lar! Veja outros pets disponíveis.</p>
              <Link to="/" className="btn-adopt-outline">Ver outros pets</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PetProfile
