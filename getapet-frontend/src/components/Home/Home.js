import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../../context/UserContext'
import Navbar from '../layout/Navbar'
import api from '../../utils/api'
import './Home.css'

const API_BASE = 'http://localhost:5000'

function fallbackEmoji(breed = '') {
  const b = breed.toLowerCase()
  if (b.includes('gat') || b.includes('cat') || b.includes('fel')) return '🐱'
  if (b.includes('coelh') || b.includes('rabbit'))                   return '🐰'
  if (b.includes('pass') || b.includes('bird') || b.includes('periq')) return '🐦'
  return ''
}

function Home() {
  const { authenticated } = useContext(Context)
  const [pets, setPets]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/pets')
      .then(({ data }) => setPets(data.pets))
      .catch(() => setPets([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home-container">
      <Navbar />

      <main>
        {!authenticated && (
          <section className="hero">
            <div className="hero-content">
              <span className="badge"> Adote com amor</span>
              <h1>Encontre seu<br /><span>companheiro</span> perfeito</h1>
              <p>Conectamos pets que precisam de um lar com famílias cheias de amor. Adote, não compre.</p>
              <div className="hero-actions">
                <Link to="/register" className="btn-primary">Começar agora</Link>
                <Link to="/login"    className="btn-secondary">Já tenho conta</Link>
              </div>
            </div>
            <div className="hero-illustration">
              <span></span>
            </div>
          </section>
        )}

        <section className="pets-section">
          <div className="section-header">
            <h2>Adote um Pet</h2>
            <p>Veja os detalhes de cada um e conheça o tutor</p>
          </div>

          {loading ? (
            <div className="pets-loading">
              <span className="loading-spinner" />
              <p>Carregando pets...</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="pets-empty">
              <span></span>
              <p>Nenhum pet cadastrado ainda.{authenticated && <> <Link to="/addpet">Cadastre o primeiro!</Link></>}</p>
            </div>
          ) : (
            <div className="pets-grid">
              {pets.map((pet) => {
                const imgSrc = pet.images?.length > 0
                  ? `${API_BASE}/images/pets/${pet.images[0]}`
                  : null
                return (
                  <div className="pet-card" key={pet._id}>
                    <div className="pet-card-img-wrap">
                      {imgSrc ? (
                        <img src={imgSrc} alt={pet.name} className="pet-card-img" />
                      ) : (
                        <div className="pet-card-emoji-placeholder">
                          {fallbackEmoji(pet.breed)}
                        </div>
                      )}
                      <span className={`pet-card-status ${pet.available ? 'status-available' : 'status-adopted'}`}>
                        {pet.available ? ' Disponível' : ' Adotado'}
                      </span>
                    </div>
                    <div className="pet-card-body">
                      <h3 className="pet-card-name">{pet.name}</h3>
                      <p className="pet-card-breed">{pet.breed}</p>
                      <div className="pet-card-meta">
                        <span> {pet.weight}</span>
                        <span> {pet.age}</span>
                      </div>
                      {pet.available ? (
                        <Link to={`/pet/${pet._id}`} className="btn-details">
                          Mais detalhes →
                        </Link>
                      ) : (
                        <div className="btn-details btn-details--disabled">Adotado </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Home
