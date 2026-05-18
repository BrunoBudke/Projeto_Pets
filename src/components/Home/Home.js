import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../context/UserContext';
import { petsData } from '../PetProfile/PetProfile';

function Home() {
  const { authenticated, currentUser, logout } = useContext(Context);
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">Get A Pet</div>
        <div className="nav-links">
          {authenticated ? (
            <>
              <span className="nav-username">Olá, {currentUser?.name?.split(' ')[0]}!</span>
              <button className="btn-logout" onClick={() => logout(navigate)}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register" className="btn-register">Cadastrar</Link>
            </>
          )}
        </div>
      </nav>

      <main>
        
        <div className="hero">
          <div className="hero-content">
            <span className="badge">Adote com amor</span>
            <h1>Encontre seu<br /><span>companheiro</span> perfeito</h1>
            <p>Conectamos pets que precisam de um lar com famílias cheias de amor. Adote, não compre.</p>
            <div className="hero-actions">
              {authenticated ? (
                <a href="#pets" className="btn-primary">Ver pets disponíveis</a>
              ) : (
                <>
                  <Link to="/register" className="btn-primary">Começar agora</Link>
                  <Link to="/login" className="btn-secondary">Já tenho conta</Link>
                </>
              )}
            </div>
          </div>

          
          <div className="hero-visual">
            {petsData.filter(p => p.available).slice(0, 2).map((pet, i) => (
              <Link to={`/pet/${pet.id}`} key={pet.id} className={`hero-pet-link ${i === 1 ? 'hero-pet-link--offset' : ''}`}>
                <div className="hero-pet-card">
                  <img src={pet.image} alt={pet.name} className="hero-pet-avatar" />
                  <p className="hero-pet-name">{pet.name}</p>
                  <p className="hero-pet-breed">{pet.breed}</p>
                  <span className="hero-pet-tag">Disponível</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        
        <section className="pets-section" id="pets">
          <div className="pets-section-header">
            <h2>Pets esperando por um lar</h2>
            <p>
              {authenticated
                ? 'Clique em um pet para iniciar a adoção'
                : 'Faça login para adotar'}
            </p>
          </div>

          <div className="pets-grid">
            {petsData.map((pet) => (
              <Link to={`/pet/${pet.id}`} key={pet.id} className="pet-grid-card">
                
                <div className="pet-avatar-wrap">
                  <div className={`pet-avatar-ring ${pet.available ? 'ring-available' : 'ring-adopted'}`}>
                    <img src={pet.image} alt={pet.name} className="pet-avatar-img" />
                  </div>
                  <span className={`pet-status-dot ${pet.available ? 'dot-ok' : 'dot-no'}`} />
                </div>

                <div className="pet-grid-info">
                  <h3>{pet.name}</h3>
                  <p className="pet-grid-breed">{pet.breed}</p>

                  <div className="pet-grid-meta">
                    <span>{pet.age}</span>
                    <span>{pet.weight}</span>
                    <span>{pet.color}</span>
                  </div>

                  <span className={`pet-grid-status ${pet.available ? 'status-ok' : 'status-no'}`}>
                    {pet.available ? 'Disponível' : 'Adotado'}
                  </span>

                  <span className="pet-grid-cta">
                    {pet.available
                      ? authenticated ? 'Quero adotar' : 'Ver perfil'
                      : 'Ver detalhes'} &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
