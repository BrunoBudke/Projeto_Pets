import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../layout/Navbar'
import api from '../../../utils/api'
import useFlashMessage from '../../../hooks/useFlashMessage'
import './AdoptionFlow.css'

const API_BASE = 'http://localhost:5000'
const STEPS = ['Seus dados', 'Agendar visita', 'Confirmar']
const AVAILABLE_TIMES = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00']

function getNext14Days() {
  const days = []
  const now = new Date()
  const dayNames   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      days.push({
        label: dayNames[d.getDay()],
        day:   d.getDate(),
        month: monthNames[d.getMonth()],
        full:  d.toLocaleDateString('pt-BR'),
      })
    }
  }
  return days.slice(0, 8)
}

export default function AdoptionFlow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setFlashMessage } = useFlashMessage()

  const [pet, setPet]               = useState(null)
  const [loading, setLoading]       = useState(true)
  const [notFound, setNotFound]     = useState(false)
  const [step, setStep]             = useState(0)
  const [form, setForm]             = useState({ name:'', email:'', phone:'', message:'' })
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [done, setDone]             = useState(false)
  const [errors, setErrors]         = useState({})
  const [confirming, setConfirming] = useState(false)

  const days = getNext14Days()

  useEffect(() => {
    api.get(`/pets/${id}`)
      .then(({ data }) => setPet(data.pet))
      .catch((err) => { if (err.response?.status === 404) setNotFound(true) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="af-page"><Navbar />
      <div className="af-notfound"><span></span><h2>Carregando...</h2></div>
    </div>
  )
  if (notFound || !pet) return (
    <div className="af-page"><Navbar />
      <div className="af-notfound"><span></span><h2>Pet não encontrado</h2><Link to="/">Voltar</Link></div>
    </div>
  )

  const imgSrc = pet.images?.length > 0 ? `${API_BASE}/images/pets/${pet.images[0]}` : null

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validateStep0() {
    const e = {}
    if (!form.name.trim())  e.name  = 'Informe seu nome'
    if (!form.email.trim()) e.email = 'Informe seu e-mail'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido'
    if (!form.phone.trim()) e.phone = 'Informe seu telefone'
    return e
  }

  function validateStep1() {
    const e = {}
    if (!selectedDate) e.date = 'Escolha uma data'
    if (!selectedTime) e.time = 'Escolha um horário'
    return e
  }

  function next() {
    if (step === 0) { const e = validateStep0(); if (Object.keys(e).length) { setErrors(e); return } }
    if (step === 1) { const e = validateStep1(); if (Object.keys(e).length) { setErrors(e); return } }
    setStep(step + 1)
  }

  async function confirm() {
    setConfirming(true)
    try {
      await api.patch(`/pets/${pet._id}/adopt`)
      setDone(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao confirmar adoção.'
      setFlashMessage(msg, 'error')
      if (err.response?.status === 400) navigate('/')
    } finally {
      setConfirming(false)
    }
  }

  if (done) return (
    <div className="af-page">
      <Navbar />
      <div className="af-success">
        <h2>Adoção confirmada!</h2>
        <p>Parabéns, <strong>{form.name}</strong>! Sua visita para conhecer <strong>{pet.name}</strong> está agendada para:</p>
        <div className="af-success-box">
          <span> {selectedDate}</span>
          <span> {selectedTime}</span>
        </div>
        <p className="af-success-sub">Um e-mail de confirmação será enviado para <strong>{form.email}</strong>.</p>
        <div className="af-success-pet">
          {imgSrc ? <img src={imgSrc} alt={pet.name} /> : <span style={{ fontSize:'2.5rem' }}></span>}
          <span>{pet.name} mal pode esperar! </span>
        </div>
        <Link to="/" className="af-btn-home">Ver outros pets</Link>
      </div>
    </div>
  )

  return (
    <div className="af-page">
      <Navbar />
      <main className="af-main">
        <div className="af-pet-bar">
          {imgSrc
            ? <img src={imgSrc} alt={pet.name} className="af-pet-thumb" />
            : <span style={{ fontSize:'2rem' }}></span>}
          <div>
            <p className="af-pet-label">Adotando</p>
            <p className="af-pet-name">{pet.name} <span>· {pet.breed}</span></p>
          </div>
        </div>

        <div className="af-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`af-step ${i === step ? 'active':''} ${i < step ? 'done':''}`}>
              <div className="af-step-circle">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
          <div className="af-step-line" style={{ width:`${(step/(STEPS.length-1))*100}%` }} />
        </div>

        
        {step === 0 && (
          <div className="af-card">
            <h2>Seus dados</h2>
            <p className="af-card-sub">Precisamos conhecer você antes da visita</p>
            <div className="af-form">
              {[
                { name:'name',    label:'Nome completo',  type:'text',  placeholder:'Seu nome' },
                { name:'email',   label:'E-mail',         type:'email', placeholder:'seu@email.com' },
                { name:'phone',   label:'Telefone',       type:'tel',   placeholder:'(00) 00000-0000' },
              ].map(f => (
                <div className="af-field" key={f.name}>
                  <label>{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]}
                    onChange={handleChange} placeholder={f.placeholder}
                    className={errors[f.name] ? 'error' : ''} />
                  {errors[f.name] && <span className="af-error">{errors[f.name]}</span>}
                </div>
              ))}
              <div className="af-field">
                <label>Mensagem <span style={{ color:'#bbb' }}>(opcional)</span></label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder={`Conte um pouco sobre você para ${pet.name}...`} rows={3} />
              </div>
            </div>
          </div>
        )}

        
        {step === 1 && (
          <div className="af-card">
            <h2>Agendar visita</h2>
            <p className="af-card-sub">Escolha o melhor dia e horário para conhecer {pet.name}</p>
            <span className="af-section-label"> Selecione a data</span>
            {errors.date && <span className="af-error" style={{ display:'block', marginBottom:'0.5rem' }}>{errors.date}</span>}
            <div className="af-dates">
              {days.map((d) => (
                <button key={d.full}
                  className={`af-date-btn ${selectedDate === d.full ? 'selected' : ''}`}
                  onClick={() => { setSelectedDate(d.full); setErrors({ ...errors, date:'' }) }}>
                  <span className="af-date-weekday">{d.label}</span>
                  <span className="af-date-day">{d.day}</span>
                  <span className="af-date-month">{d.month}</span>
                </button>
              ))}
            </div>
            <span className="af-section-label" style={{ marginTop:'1.5rem', display:'block' }}> Selecione o horário</span>
            {errors.time && <span className="af-error" style={{ display:'block', marginBottom:'0.5rem' }}>{errors.time}</span>}
            <div className="af-times">
              {AVAILABLE_TIMES.map((t) => (
                <button key={t}
                  className={`af-time-btn ${selectedTime === t ? 'selected' : ''}`}
                  onClick={() => { setSelectedTime(t); setErrors({ ...errors, time:'' }) }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        
        {step === 2 && (
          <div className="af-card">
            <h2>Confirmar adoção</h2>
            <p className="af-card-sub">Revise as informações antes de confirmar</p>
            <div className="af-review">
              <div className="af-review-section">
                <h4> Seus dados</h4>
                {[['Nome',form.name],['E-mail',form.email],['Telefone',form.phone],
                  ...(form.message ? [['Mensagem',form.message]] : [])
                ].map(([k,v]) => (
                  <div className="af-review-row" key={k}><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
              <div className="af-review-section">
                <h4> Visita agendada</h4>
                <div className="af-review-row"><span>Data</span><strong>{selectedDate}</strong></div>
                <div className="af-review-row"><span>Horário</span><strong>{selectedTime}</strong></div>
              </div>
              <div className="af-review-section">
                <h4> Pet</h4>
                <div className="af-review-row"><span>Nome</span><strong>{pet.name}</strong></div>
                <div className="af-review-row"><span>Raça</span><strong>{pet.breed}</strong></div>
              </div>
            </div>
            <div className="af-terms">
              <input type="checkbox" id="terms" defaultChecked />
              <label htmlFor="terms">
                Estou ciente que a visita não garante a adoção imediata e que a decisão final será feita após o encontro.
              </label>
            </div>
          </div>
        )}

        <div className="af-nav">
          {step > 0 && <button className="af-btn-back" onClick={() => setStep(step - 1)}>← Voltar</button>}
          {step < 2
            ? <button className="af-btn-next" onClick={next}>{step === 0 ? 'Escolher data →' : 'Revisar →'}</button>
            : <button className="af-btn-confirm" onClick={confirm} disabled={confirming}>
                {confirming ? ' Confirmando...' : ' Confirmar adoção'}
              </button>
          }
        </div>
      </main>
    </div>
  )
}
