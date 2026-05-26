import { useState, useEffect, useCallback } from 'react'
import Navbar from '../../layout/Navbar'
import './Explore.css'

//  APIs EXTERNAS UTILIZADAS
//
//  1. Dog CEO API — https://dog.ceo/dog-api/  (gratuita, sem chave)
//     • Lista todas as raças disponíveis e retorna imagens
//     • GET /breeds/list/all
//     • GET /breed/{name}/images/random/{n}
//
//  2. dogapi.dog — https://dogapi.dog/api/v2  (gratuita, sem chave)
//     • Busca características das raças (busca em todas as páginas)
//     • GET /breeds?page[number]={n}
//     • GET /facts?limit=10
//
//  3. MyMemory Translation API — https://mymemory.translated.net
//     (gratuita, sem chave — até 5.000 chars/dia por IP)
//     • Traduz textos do inglês para português do Brasil
//     • GET /get?q={text}&langpair=en|pt-BR
// ══════════════════════════════════════════════════════════════

const DOG_CEO_API   = 'https://dog.ceo/api'
const DOG_CHARS_API = 'https://dogapi.dog/api/v2'
const TRANSLATE_API = 'https://api.mymemory.translated.net/get'

// ── Cache em memória para evitar retraduções ──────────────────
const translationCache = {}

async function translateToPT(text) {
  if (!text || !text.trim()) return text
  const key = text.slice(0, 100)
  if (translationCache[key]) return translationCache[key]
  try {
    const url = `${TRANSLATE_API}?q=${encodeURIComponent(text)}&langpair=en|pt-BR&de=getapet@app.com`
    const res  = await fetch(url)
    const data = await res.json()
    if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
      const translated = data.responseData.translatedText
      translationCache[key] = translated
      return translated
    }
    return text
  } catch {
    return text
  }
}

async function translateSequential(texts, onProgress) {
  const results = []
  for (let i = 0; i < texts.length; i++) {
    const translated = await translateToPT(texts[i])
    results.push(translated)
    if (onProgress) onProgress(i + 1, texts.length)
  }
  return results
}

const POPULAR_BREEDS = [
  { pt: 'Labrador',         en: 'labrador' },
  { pt: 'Golden Retriever', en: 'retriever/golden' },
  { pt: 'Poodle',           en: 'poodle' },
  { pt: 'Beagle',           en: 'beagle' },
  { pt: 'Husky Siberiano',  en: 'husky' },
  { pt: 'Dálmata',          en: 'dalmatian' },
  { pt: 'Chihuahua',        en: 'chihuahua' },
  { pt: 'Rottweiler',       en: 'rottweiler' },
  { pt: 'Boxer',            en: 'boxer' },
  { pt: 'Bulldog',          en: 'bulldog' },
]

// Traduz do ingles para o pt
const PT_TO_SLUG = {
  'labrador':           'labrador',
  'golden':             'retriever/golden',
  'golden retriever':   'retriever/golden',
  'poodle':             'poodle',
  'beagle':             'beagle',
  'husky':              'husky',
  'husky siberiano':    'husky',
  'dalmata':            'dalmatian',
  'dálmata':            'dalmatian',
  'chihuahua':          'chihuahua',
  'rottweiler':         'rottweiler',
  'boxer':              'boxer',
  'bulldog':            'bulldog',
  'bulldog francês':    'bulldog/french',
  'bulldog frances':    'bulldog/french',
  'pastor alemão':      'germanshepherd',
  'pastor alemao':      'germanshepherd',
  'shih tzu':           'shihtzu',
  'doberman':           'doberman',
  'salsicha':           'dachshund',
  'dachshund':          'dachshund',
  'akita':              'akita',
  'pitbull':            'pitbull',
  'pit bull':           'pitbull',
  'border collie':      'collie/border',
  'pug':                'pug',
  'maltes':             'maltese',
  'maltês':             'maltese',
  'chow chow':          'chow',
  'cocker spaniel':     'spaniel/cocker',
}

function resolveSlug(input) {
  const lower = input.toLowerCase().trim()
  return PT_TO_SLUG[lower] || lower
}

function formatBreedName(slug) {
  return slug
    .split('/')
    .pop()
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}


// Lista as raças + armazena pra não precisar buscar depois
let dogApiAllBreeds = null

async function fetchAllDogApiBreeds() {
  if (dogApiAllBreeds) return dogApiAllBreeds
  const all = []
  let page = 1
  
  while (true) {
    try {
      const res  = await fetch(`${DOG_CHARS_API}/breeds?page[number]=${page}&page[size]=50`)
      const data = await res.json()
      if (!data?.data?.length) break
      all.push(...data.data)
      if (!data?.links?.next) break
      page++
      if (page > 10) break // segurança
    } catch {
      break
    }
  }
  dogApiAllBreeds = all
  return all
}


function findBreedInApi(allBreeds, searchTerm) {
  const term = searchTerm.toLowerCase().replace(/[^a-z]/g, '')
  return allBreeds.find(b => {
    const name = (b.attributes?.name || '').toLowerCase().replace(/[^a-z]/g, '')
    return name === term || name.includes(term) || term.includes(name)
  }) || null
}


export default function Explore() {
  const [activeTab, setActiveTab] = useState('breeds')
  return (
    <div className="explore-page">
      <Navbar />
      <div className="explore-hero">
        <div className="explore-hero-inner">
          <h1>Conheça o mundo <span>canino</span> </h1>
          <p>Pesquise raças, veja fotos e descubra curiosidades — tudo traduzido para português.</p>
          <div className="explore-api-badges">
            <span className="api-badge api-badge--blue"> Dog CEO API · imagens</span>
            <span className="api-badge api-badge--purple"> dogapi.dog · características</span>
            <span className="api-badge api-badge--green"> MyMemory API · tradução EN→PT</span>
          </div>
        </div>
      </div>

      <div className="explore-tabs">
        <button className={`explore-tab ${activeTab === 'breeds' ? 'active' : ''}`}
          onClick={() => setActiveTab('breeds')}> Pesquisar Raças</button>
        <button className={`explore-tab ${activeTab === 'facts' ? 'active' : ''}`}
          onClick={() => setActiveTab('facts')}> Curiosidades</button>
      </div>

      <div className="explore-content">
        {activeTab === 'breeds' ? <BreedsTab /> : <FactsTab />}
      </div>
    </div>
  )
}

//Aba: Raças
function BreedsTab() {
  const [query, setQuery]             = useState('')
  const [status, setStatus]           = useState('idle') 
  const [statusMsg, setStatusMsg]     = useState('')
  const [error, setError]             = useState(null)
  const [breedResult, setBreedResult] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [allDogCeoBreeds, setAllDogCeoBreeds] = useState([])

  useEffect(() => {
    fetch(`${DOG_CEO_API}/breeds/list/all`)
      .then(r => r.json())
      .then(({ message }) => setAllDogCeoBreeds(Object.keys(message)))
      .catch(() => {})
  }, [])

  const searchBreed = useCallback(async (term) => {
    const raw   = (term || query).trim()
    if (!raw) return
    const slug  = resolveSlug(raw) 

    setStatus('loading')
    setStatusMsg('Buscando imagens (Dog CEO API)...')
    setError(null)
    setBreedResult(null)
    setSuggestions([])

    try {
      // ── Primeira Api : (Dog Ceo) Imagens
      const imgRes  = await fetch(`${DOG_CEO_API}/breed/${slug}/images/random/6`)
      const imgData = await imgRes.json()

      if (imgData.status === 'success') {
        // ──  Segu API (dogapi.dog)  características 
        setStatusMsg('Buscando características (dogapi.dog)...')
        const allApiBreeds = await fetchAllDogApiBreeds()
        
        const baseName = slug.split('/').pop()
        const breedData = findBreedInApi(allApiBreeds, baseName)
        const chars = breedData?.attributes || null

        // Terc APi MyMemory -- traduz as descrições dos cachorros
        let translatedDesc = null
        if (chars?.description) {
          setStatus('translating')
          setStatusMsg('Traduzindo descrição (MyMemory API)...')
          translatedDesc = await translateToPT(chars.description)
        }

        setBreedResult({
          slug,
          displayName: formatBreedName(slug),
          images:      imgData.message,
          chars,
          translatedDesc,
        })
        setStatus('done')

      } else {
        setStatusMsg('Buscando raças similares...')
        const matched = allDogCeoBreeds
          .filter(b => b.includes(slug) || slug.includes(b))
          .slice(0, 8)

        if (matched.length === 0) {
          setError(`Raça "${raw}" não encontrada. Tente: Labrador, Poodle, Husky, Beagle...`)
          setStatus('error')
          return
        }

        const allApiBreeds = await fetchAllDogApiBreeds()
        const results = await Promise.all(
          matched.map(async (b) => {
            const [imgR] = await Promise.all([
              fetch(`${DOG_CEO_API}/breed/${b}/images/random`).then(r => r.json()).catch(() => ({})),
            ])
            const breedData = findBreedInApi(allApiBreeds, b.split('/').pop())
            return {
              slug:        b,
              displayName: formatBreedName(b),
              image:       imgR?.message || null,
              chars:       breedData?.attributes || null,
            }
          })
        )
        setSuggestions(results)
        setStatus('done')
      }
    } catch (err) {
      setError('Erro ao conectar com as APIs. Verifique sua conexão.')
      setStatus('error')
    }
  }, [query, allDogCeoBreeds])

  function handleKey(e) { if (e.key === 'Enter') searchBreed() }

  const isLoading = status === 'loading' || status === 'translating'

  return (
    <>
      
      <div className="explore-search-bar">
        <input
          type="text"
          placeholder=" Digite em português ou inglês: Labrador, Golden Retriever, Poodle..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="btn-search"
          onClick={() => searchBreed()}
          disabled={isLoading || !query.trim()}>
          {isLoading ? '' : 'Buscar'}
        </button>
      </div>

      
      {status === 'idle' && (
        <div className="breed-chips-section">
          <p className="chips-label">Raças populares</p>
          <div className="breed-suggestions">
            {POPULAR_BREEDS.map(b => (
              <button key={b.en} className="breed-suggestion-chip"
                onClick={() => { setQuery(b.pt); searchBreed(b.en) }}>
                {b.pt}
              </button>
            ))}
          </div>
          <div className="explore-empty">
            <span></span>
            <p>Digite em português ou inglês, ou clique em uma raça acima.</p>
          </div>
        </div>
      )}

      
      {isLoading && (
        <div className="explore-loading">
          <div className={`spinner ${status === 'translating' ? 'spinner--purple' : ''}`} />
          <p>{statusMsg}</p>
          {status === 'translating' && (
            <span className="translate-sub"> Conectando à MyMemory API...</span>
          )}
        </div>
      )}

      
      {status === 'error' && error && (
        <div className="explore-error">
          <span></span><p>{error}</p>
          <button className="btn-new-search"
            onClick={() => { setStatus('idle'); setError(null) }}>
            ← Tentar novamente
          </button>
        </div>
      )}

      
      {status === 'done' && breedResult && (
        <div className="breed-detail-panel">

          <div className="breed-detail-gallery-section">
            <div className="api-source-tag api-source-tag--blue">
               Dog CEO API · fotos de {breedResult.displayName}
            </div>
            <div className="breed-detail-gallery">
              {breedResult.images.map((img, i) => (
                <img key={i} src={img} alt={`${breedResult.displayName} ${i + 1}`}
                  className={i === 0 ? 'gallery-main' : 'gallery-thumb'}
                  loading="lazy" />
              ))}
            </div>
          </div>

          {/* Características — dogapi.dog + MyMemory */}
          <div className="breed-detail-chars-section">
            <div className="api-source-tag api-source-tag--purple">
               dogapi.dog · características da raça
            </div>
            <h2 className="breed-detail-name">{breedResult.displayName}</h2>

            {breedResult.chars ? (
              <>
                {(breedResult.translatedDesc || breedResult.chars.description) && (
                  <div className="breed-desc-wrapper">
                    <p className="breed-detail-desc">
                      {breedResult.translatedDesc || breedResult.chars.description}
                    </p>
                    {breedResult.translatedDesc && (
                      <span className="translation-badge">
                         Traduzido via MyMemory API · EN→PT-BR
                      </span>
                    )}
                  </div>
                )}

                <div className="breed-chars-grid">
                  {breedResult.chars.life && (
                    <div className="char-card">
                      
                      <p className="char-label">Expectativa de vida</p>
                      <p className="char-value">{breedResult.chars.life.min}–{breedResult.chars.life.max} anos</p>
                    </div>
                  )}
                  {breedResult.chars.male_weight && (
                    <div className="char-card">
                    
                      <p className="char-label">Peso (macho)</p>
                      <p className="char-value">{breedResult.chars.male_weight.min}–{breedResult.chars.male_weight.max} kg</p>
                    </div>
                  )}
                  {breedResult.chars.female_weight && (
                    <div className="char-card">
                      
                      <p className="char-label">Peso (fêmea)</p>
                      <p className="char-value">{breedResult.chars.female_weight.min}–{breedResult.chars.female_weight.max} kg</p>
                    </div>
                  )}
                  {breedResult.chars.hypoallergenic !== undefined && (
                    <div className="char-card">
                      
                      <p className="char-label">Hipoalergênico</p>
                      <p className="char-value">{breedResult.chars.hypoallergenic ? ' Sim' : ' Não'}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="chars-not-found">
                <p>Características não encontradas na dogapi.dog para esta raça.</p>
              </div>
            )}

            <button className="btn-new-search"
              onClick={() => { setBreedResult(null); setSuggestions([]); setQuery(''); setStatus('idle') }}>
              ← Nova busca
            </button>
          </div>
        </div>
      )}

      
      {status === 'done' && suggestions.length > 0 && (
        <>
          <p className="suggestions-title">
            {suggestions.length} raças encontradas para "<strong>{query}</strong>"
          </p>
          <div className="breeds-grid">
            {suggestions.map((item, idx) => (
              <div className="breed-card" key={idx}
                onClick={() => { setQuery(item.displayName); searchBreed(item.slug) }}>
                {item.image
                  ? <img src={item.image} alt={item.displayName} className="breed-card-img" loading="lazy" />
                  : <div className="breed-card-img-placeholder"></div>}
                <div className="breed-card-body">
                  <p className="breed-card-name">{item.displayName}</p>
                  {item.chars?.life && (
                    <p className="breed-card-sub"> {item.chars.life.min}–{item.chars.life.max} anos</p>
                  )}
                  <p className="breed-card-action">Ver detalhes →</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

//Curiosidades 
function FactsTab() {
  const [facts, setFacts]   = useState([])       
  const [status, setStatus]  = useState('idle')   
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [error, setError]    = useState(null)

  const loadFacts = useCallback(async () => {
    setStatus('loading')
    setError(null)
    setFacts([])
    setProgress({ done: 0, total: 0 })

    try {
      // Busca as curiosidades (vem em inggles)
      const res  = await fetch(`${DOG_CHARS_API}/facts?limit=10`)
      const data = await res.json()

      if (!data?.data?.length) {
        setError('Não foi possível carregar as curiosidades. Tente novamente.')
        setStatus('error')
        return
      }

      const englishFacts = data.data.map(item => item.attributes.body)
      setProgress({ done: 0, total: englishFacts.length })

      // Traduz as curiosidades
      setStatus('translating')
      const translated = await translateSequential(
        englishFacts,
        (done, total) => setProgress({ done, total })
      )

      setFacts(translated)
      setStatus('done')
    } catch {
      setError('Erro ao conectar com as APIs. Verifique sua conexão.')
      setStatus('error')
    }
  }, [])

  useEffect(() => { loadFacts() }, [loadFacts])

  const isLoading = status === 'loading' || status === 'translating'

  return (
    <>
      <div className="facts-header">
        <div>
          <h2>Sabia que...? </h2>
          <p className="facts-source">
            Fonte: <strong>dogapi.dog/api/v2/facts</strong>
            {' '}· traduzido por <strong>MyMemory API</strong>
          </p>
        </div>
        <button className="btn-new-facts" onClick={loadFacts} disabled={isLoading}>
          {isLoading ? ' Aguarde...' : ' Novas curiosidades'}
        </button>
      </div>

      
      {status === 'loading' && (
        <div className="explore-loading">
          <div className="spinner" />
          <p>Buscando curiosidades na dogapi.dog...</p>
        </div>
      )}

      
      {status === 'translating' && (
        <div className="explore-loading">
          <div className="spinner spinner--purple" />
          <p>Traduzindo para português via MyMemory API...</p>
          <div className="progress-bar-wrap">
            <div className="progress-bar"
              style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </div>
          <span className="translate-sub">
            {progress.done} de {progress.total} curiosidades traduzidas
          </span>
        </div>
      )}

      {/* Erro */}
      {status === 'error' && (
        <div className="explore-error">
          <span></span><p>{error}</p>
          <button className="btn-search" onClick={loadFacts} style={{ marginTop: '0.5rem' }}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Resultado */}
      {status === 'done' && facts.length > 0 && (
        <>
          <div className="facts-translated-badge">
             {facts.length} Curiosidades do mundo canino traduzidas via MyMemory API
          </div>
          <div className="facts-grid">
            {facts.map((fact, idx) => (
              <div className="fact-card" key={idx}>
                <div className="fact-icon">{FACT_ICONS[idx % FACT_ICONS.length]}</div>
                <div className="fact-body">
                  <p className="fact-number">Curiosidade #{idx + 1}</p>
                  <p className="fact-text">{fact}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
