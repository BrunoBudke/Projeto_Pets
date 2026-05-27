import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../../../context/UserContext'
import Navbar from '../../layout/Navbar'
import api from '../../../utils/api'
import useFlashMessage from '../../../hooks/useFlashMessage'
import './MyPets.css'

const API_BASE = 'http://localhost:5000'

function fallbackEmoji(breed = '') {
  const b = breed.toLowerCase()
  if (b.includes('gat') || b.includes('cat')) return ''
  if (b.includes('coelh') || b.includes('rabbit')) return ''
  return ''
}

export default function MyPets() {
  const { authenticated } = useContext(Context)
  const { setFlashMessage } = useFlashMessage()

  const [pets, setPets]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [toDelete, setToDelete]   = useState(null)   // Deletar pet
  const [deleting, setDeleting]   = useState(false)

  useEffect(() => {
    if (!authenticated) return
    api.get('/pets/mypets')
      .then(({ data }) => setPets(data.pets))
      .catch(() => setPets([]))
      .finally(() => setLoading(false))
  }, [authenticated])

  async function confirmDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await api.delete(`/pets/${toDelete._id}`)
      setPets(prev => prev.filter(p => p._id !== toDelete._id))
      setFlashMessage(`${toDelete.name} foi removido.`, 'success')
    } catch (err) {
      setFlashMessage(err.response?.data?.message || 'Erro ao remover pet.', 'error')
    } finally {
      setDeleting(false)
      setToDelete(null)
    }
  }

  if (!authenticated) return (
    <div className="mypets-page">
      <Navbar />
      <div className="mypets-empty">
        <span></span>
        <h3>Acesso restrito</h3>
        <p>Faça login para ver seus pets.</p>
        <Link to="/login" style={{ color:'#16479d', fontWeight:800, textDecoration:'none' }}>Fazer login →</Link>
      </div>
    </div>
  )

  return (
    <div className="mypets-page">
      <Navbar />

      <main className="mypets-main">
        <div className="mypets-top">
          <div>
            <h1> Meus Pets</h1>
            <p>Gerencie os pets que você colocou para adoção</p>
          </div>
          <Link to="/addpet" className="btn-add-pet">+ Cadastrar novo pet</Link>
        </div>

        {loading ? (
          <div className="mypets-loading">
            <div className="mypets-spinner" />
            <p>Carregando seus pets...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="mypets-empty">
            <span></span>
            <h3>Você ainda não cadastrou nenhum pet</h3>
            <p>Cadastre um pet para colocá-lo disponível para adoção.</p>
            <Link to="/addpet" className="btn-add-pet" style={{ marginTop:'0.5rem' }}>
              + Cadastrar meu primeiro pet
            </Link>
          </div>
        ) : (
          <div className="mypets-grid">
            {pets.map(pet => {
              const imgSrc = pet.images?.length > 0
                ? `${API_BASE}/images/pets/${pet.images[0]}`
                : null

              return (
                <div className="mypet-card" key={pet._id}>
                  <div className="mypet-img-wrap">
                    {imgSrc ? (
                      <img src={imgSrc} alt={pet.name} className="mypet-img" />
                    ) : (
                      <div className="mypet-emoji-placeholder">{fallbackEmoji(pet.breed)}</div>
                    )}
                    <span className={`mypet-badge ${pet.available ? 'badge-available' : 'badge-adopted'}`}>
                      {pet.available ? ' Disponível' : ' Adotado'}
                    </span>
                  </div>

                  <div className="mypet-body">
                    <p className="mypet-name">{pet.name}</p>
                    <p className="mypet-breed">{pet.breed}</p>
                    <div className="mypet-meta">
                      <span> {pet.weight}</span>
                      <span> {pet.age}</span>
                    </div>
                    <div className="mypet-actions">
                      <Link to={`/pet/${pet._id}`} className="btn-mypet-view">Ver perfil</Link>
                      <button
                        className="btn-mypet-delete"
                        onClick={() => setToDelete(pet)}
                        disabled={!pet.available}
                        title={!pet.available ? 'Pet já adotado' : 'Remover pet'}
                      >
                         Remover
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      
      {toDelete && (
        <div className="delete-modal-overlay" onClick={() => !deleting && setToDelete(null)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            
            <h3>Remover {toDelete.name}?</h3>
            <p>Esta ação não pode ser desfeita. O pet será removido permanentemente da lista de adoção.</p>
            <div className="delete-modal-btns">
              <button className="btn-cancel" onClick={() => setToDelete(null)} disabled={deleting}>
                Cancelar
              </button>
              <button className="btn-delete-confirm" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Removendo...' : 'Sim, remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
