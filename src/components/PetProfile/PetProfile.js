import { Link, useParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from '../../context/UserContext'
import './PetProfile.css'

import catiorroImg from './img/catiorro.webp'
import PoodleImg   from './img/Poodle.webp'
import labradorImg from './img/labrador.webp'
import LhasaImg from './img/Lhasa.webp'
import YorkshireImg from './img/Yorkshire.webp'
import rottweilerImg from './img/rottweiler.webp'
import KomondorImg from './img/Komondor.webp'
import BorderCollieImg from './img/BorderCollie.webp'
import SalsichaImg from './img/Salsicha.webp'
import MiniaturaImg from './img/Miniatura.webp'
import AkitaImp from './img/Akita.webp'
import GoldenImg from './img/Golden.webp'

export const petsData = [
  {
    id: 1,
    name: 'Tales',
    breed: 'Poodle',
    age: '3 anos',
    weight: '8kg',
    color: 'Marrom',
    description: 'Tales é um poodle alegre e cheio de energia, Adora correr ao ar livre, brincar com bolinhas e receber carinho. É ótimo com crianças e convive bem com outros animais. Já vacinado e castrado, pronto para seu novo lar.',
    recomendacao: 'Ideal para apartamentos e casas pequenas. Poodles se adaptam bem a qualquer ambiente e são ótimos para famílias com crianças. Prefere climas amenos — evite exposição ao frio intenso.',
    available: true,
    image: PoodleImg,
  },
  {
    id: 2,
    name: 'Pretinho',
    breed: 'Labrador',
    age: '1 ano',
    weight: '10kg',
    color: 'Preto',
    description: 'Pretinho é um filhote de Labrador curioso e brincalhão. Aprende rápido e adora explorar, Perfeito para famílias com filhos e espaço, Vacinado e vermifugado.',
    recomendacao: 'Precisa de espaço e exercício diário. Recomendado para casas com quintal. Suporta bem calor e frio moderados. Ótimo com crianças e outros animais.',
    available: true,
    image: catiorroImg,
  },
  {
    id: 3,
    name: 'Soneca',
    breed: 'Lhasa Apso',
    age: '15 anos',
    weight: '9kg',
    color: 'Marrom',
    description: 'Soneca é um cachorrro Idoso, mas não deixe isso te enganar, ele adora brincar de bolinha e momentos confortaveis no sófa. Ideal para famiias grandes. Vacinado e vermifugado',
    recomendacao: 'Perfeito para apartamentos. O pelo longo exige escovação frequente. Sensível ao calor extremo — mantenha-o em ambientes frescos no verão.',
    available: true,
    image: LhasaImg,
  },
  {
    id: 4,
    name: 'Caco',
    breed: 'Yorkshire',
    age: '3 meses',
    weight: '0.9 kg',
    color: 'Prata',
    description: 'Caco é um filhote pequeno e amoroso, com uma curiosidade maior que ele. Protetor e leal, é o companheiro perfeito para famílias ativas. Já foi adotado e vive feliz em seu novo lar.',
    recomendacao: 'Apesar do tamanho pequeno, tem muita energia. Adapta-se bem a apartamentos. Sensível ao frio — use roupinhas em dias mais frios.',
    available: false,
    image: YorkshireImg,
  },
  {
    id: 5,
    name: 'Princesa',
    breed: 'Rottweiler',
    age: '4 anos',
    weight: '44kg',
    color: 'Preto e Marrom',
    description: 'Princesa é uma rottweiler dócil, leal e muito protetora. Adora brincar e é extremamente carinhosa com sua família. Necessita de adestramento e socialização desde cedo.',
    recomendacao: 'Recomendado para casas com quintal amplo. Por ser um cachorro grande e forte, é ideal para tutores experientes. Suporta bem o frio, mas precisa de sombra no calor.',
    available: true,
    image: rottweilerImg,
  },
  {
    id: 6,
    name: 'Mauricio',
    breed: 'Komondor',
    age: '4 anos',
    weight: '50kg',
    color: 'Branco',
    description: 'Mauricio é um Komondor imponente e cheio de personalidade. Seu pelo em cordas é único e inconfundível. É um excelente guardião e muito leal à sua família.',
    recomendacao: 'Precisa de espaço amplo e não é indicado para apartamentos. O pelo especial exige cuidados frequentes. Adapta-se melhor a climas frios — o calor intenso pode ser desconfortável para ele.',
    available: true,
    image: KomondorImg,
  },
  {
    id: 7,
    name: 'Bingo',
    breed: 'Border Collie',
    age: '3 anos',
    weight: '20kg',
    color: 'Branco e Preto',
    description: 'Mauricio é um cão de porte médio, atlético e ágil. é amplamente reconhecida como a mais inteligente do mundo, destacando-se por sua capacidade excepcional de aprender comandos, resolver problemas e executar tarefas complexas. Seu temperamento é energético, leal e sociável, mas exige exercício físico e estimulação mental diários intensos para evitar comportamentos destrutivos ou ansiosos devido à sua natureza de trabalho e alta energia',
    recomendacao: 'Precisa de espaço amplo e não é indicado para apartamentos. Devido a sua raça ser de trabalho, Requer pelo menos 1 hora de atividade física diária, incluindo corridas, agility e brincadeiras interativas, para manter o equilíbrio mental, não é ideal para famílias sedentárias ou que deixam o cão sozinho por longos períodos',
    available: true,
    image: BorderCollieImg,
  },
  {
    id: 8,
    name: 'Pipoca',
    breed: 'Dachshunds (Standard)',
    age: ' 1 ano',
    weight: '12 kg',
    color: 'Preto',
    description: 'Pipoca é alegre e curioso, adora ficar junto aos seus tutores, inteligentes e bastante ativos, ideal para apartamentos e para quem busca um cão de porte pequeno com muita personalidade',
    recomendacao: 'Possuem corpo alongado e são predispostos a hérnia de disco (IVDD). É essencial evitar que pulem de móveis ou escadas, utilizando rampas ou degraus, e manter o peso controlado para não sobrecarregar a coluna.',
    available: true,
    image: SalsichaImg,
  },
  {
    id: 9,
    name: 'Slinky',
    breed: 'Dachshunds (Miniatura)',
    age: ' 8 meses',
    weight: '5 kg',
    color: 'Branco com orelhas pretas',
    description: 'Slinky é alegre, corajoso e curioso, adora cavar em quintais e dormir debaixo de suas cobertas. Adora crianças e é ideal para familias',
    recomendacao: 'Possuem corpo alongado e são predispostos a hérnia de disco (IVDD). É essencial evitar que pulem de móveis ou escadas, utilizando rampas ou degraus, e manter o peso controlado para não sobrecarregar a coluna.',
    available: false,
    image: MiniaturaImg,
  },
  {
    id: 10,
    name: 'Jojo',
    breed: 'Akita Inu',
    age: ' 5 meses',
    weight: '52 kg',
    color: 'Branco e Laranja',
    description: 'Jojo é calmo e silencioso, mas profundamento afetuoso e protetor com sua familia, possue personaliddade forte, independente e dominante, pode viver em apartamentos, mas exige cuidados importantes!',
    recomendacao: 'É essencial levar o cão para caminhadas longas (mínimo de 45 minutos a 1 hora por dia) para gastar energia e estimular sua mente, Os Akita tem personalidade forte, dominante e precisa de socialização precoce e treinamento firme com reforço positivo. Não é recomendado para donos de primeira viagem',
    available: false,
    image: AkitaImp,
  },
  {
    id: 11,
    name: 'Jake',
    breed: 'Golden Retriever',
    age: ' 2 Anos',
    weight: '23 kg',
    color: 'Laranja',
    description: 'Jake é afetuoso, brincalhão e muito sociavel, adora atenção e carinho(até de estranhos), adora praias, agua e rolar na areia e lama. excelente para familias e crianças',
    recomendacao: 'Tendência a obesidade, displasia de quadril e cotovelo, problemas oculares (como catarata) e cardiopatias Exige escovação frequente para controlar a queda de pelo (que é intensa duas vezes ao ano) e banhos periódicos para evitar dermatites',
    available: true,
    image: GoldenImg,
  },
]

function PetProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { authenticated, logout } = useContext(Context)
  const pet = petsData.find((p) => p.id === Number(id))

  if (!pet) {
    return (
      <div className="pet-not-found">
        <div className="not-found-icon">?</div>
        <h2>Pet não encontrado</h2>
        <Link to="/">Voltar para adoção</Link>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-header-inner">
          <Link to="/" className="profile-logo">Get A Pet</Link>
          <nav className="profile-nav">
            <Link to="/">Início</Link>
            {authenticated
              ? <button className="nav-logout-btn" onClick={() => logout(navigate)}>Sair</button>
              : <>
                  <Link to="/login">Entrar</Link>
                  <Link to="/register" className="nav-register">Cadastrar</Link>
                </>
            }
          </nav>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-avatar-wrap">
          <div className={`profile-avatar-ring ${pet.available ? 'ring-available' : 'ring-adopted'}`}>
            <img src={pet.image} alt={pet.name} className="profile-avatar-img" />
          </div>
          <span className={`profile-status-badge ${pet.available ? 'badge-available' : 'badge-adopted'}`}>
            {pet.available ? 'Disponível' : 'Adotado'}
          </span>
        </div>

        <div className="profile-card">
          <h1 className="profile-name">{pet.name}</h1>
          <p className="profile-breed">{pet.breed}</p>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{pet.age}</span>
              <span className="stat-label">Idade</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{pet.weight}</span>
              <span className="stat-label">Peso</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{pet.color}</span>
              <span className="stat-label">Cor</span>
            </div>
          </div>

          <div className="profile-description">
            <div className="description-header">
              <span className="description-label">Sobre {pet.name}</span>
            </div>
            <p className="description-text">{pet.description}</p>
          </div>

          {pet.recomendacao && (
            <div className="profile-recommendation">
              <div className="recommendation-header">
                <span className="recommendation-tag">Recomendação</span>
              </div>
              <p className="recommendation-text">{pet.recomendacao}</p>
            </div>
          )}

          {pet.available ? (
            authenticated ? (
              <Link to={`/adopt/${pet.id}`} className="btn-adopt-profile">
                Quero adotar {pet.name}
              </Link>
            ) : (
              <div className="adopt-cta">
                <p className="adopt-cta-hint">Faça login para iniciar a adoção</p>
                <div className="adopt-cta-btns">
                  <Link to="/login" className="btn-adopt-profile">Entrar</Link>
                  <Link to="/register" className="btn-adopt-outline">Criar conta</Link>
                </div>
              </div>
            )
          ) : (
            <div className="adopted-msg">
              <p className="adopted-msg-title">Já encontrou um lar</p>
              <p>{pet.name} foi adotado e vive feliz! Conheça outros pets disponíveis.</p>
              <Link to="/" className="btn-adopt-outline">Ver outros pets</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PetProfile
