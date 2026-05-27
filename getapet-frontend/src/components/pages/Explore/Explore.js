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

// ── Ícones para os cards de curiosidades (estava faltando — causava crash) ─
const FACT_ICONS = ['🐾', '🦴', '🐕', '🐶', '🏅', '🌟', '💡', '🔬', '🎯', '🐩']

// ── Fallback local para raças populares (usado quando dogapi.dog falha) ────
const BREED_FALLBACK = {
  labrador: {
    description: 'O Labrador Retriever é uma das raças mais populares do mundo, conhecida por sua personalidade amigável, inteligência e disposição para aprender.',
    life: { min: 10, max: 12 },
    male_weight: { min: 29, max: 36 },
    female_weight: { min: 25, max: 32 },
    hypoallergenic: false,
  },
  husky: {
    description: 'O Husky Siberiano é uma raça de trabalho ativa e resistente, originária da Sibéria. É conhecido por sua resistência ao frio, olhos marcantes e personalidade amigável.',
    life: { min: 12, max: 14 },
    male_weight: { min: 20, max: 27 },
    female_weight: { min: 16, max: 23 },
    hypoallergenic: false,
  },
  golden: {
    description: 'O Golden Retriever é uma raça gentil, confiável e confiável, conhecida por sua pelagem dourada e temperamento amigável. É amplamente utilizado como cão de terapia e assistência.',
    life: { min: 10, max: 12 },
    male_weight: { min: 29, max: 34 },
    female_weight: { min: 25, max: 29 },
    hypoallergenic: false,
  },
  poodle: {
    description: 'O Poodle é uma das raças mais inteligentes do mundo, muito versátil e ativo. Existem quatro tamanhos reconhecidos: gigante, grande, médio e toy.',
    life: { min: 12, max: 15 },
    male_weight: { min: 20, max: 32 },
    female_weight: { min: 20, max: 32 },
    hypoallergenic: true,
  },
  beagle: {
    description: 'O Beagle é uma raça compacta, robusta e de porte médio, com um temperamento amigável e curioso. É muito usado como cão farejador devido ao seu olfato aguçado.',
    life: { min: 12, max: 15 },
    male_weight: { min: 10, max: 11 },
    female_weight: { min: 9, max: 10 },
    hypoallergenic: false,
  },
  dalmatian: {
    description: 'O Dálmata é conhecido por suas manchas únicas e pela sua energia vibrante. É uma raça ativa que precisa de muito exercício e estimulação mental.',
    life: { min: 10, max: 13 },
    male_weight: { min: 27, max: 32 },
    female_weight: { min: 24, max: 29 },
    hypoallergenic: false,
  },
  chihuahua: {
    description: 'O Chihuahua é a menor raça de cão do mundo, mas possui uma personalidade enorme. É leal, alerta e muito apegado ao seu dono.',
    life: { min: 14, max: 16 },
    male_weight: { min: 1, max: 3 },
    female_weight: { min: 1, max: 3 },
    hypoallergenic: false,
  },
  rottweiler: {
    description: 'O Rottweiler é uma raça robusta e poderosa, originalmente criada para trabalho pesado. É leal, confiante e protetor, sendo excelente cão de guarda quando bem socializado.',
    life: { min: 9, max: 10 },
    male_weight: { min: 50, max: 60 },
    female_weight: { min: 35, max: 48 },
    hypoallergenic: false,
  },
  boxer: {
    description: 'O Boxer é uma raça alegre, brincalhona e leal. É muito energético e adora interagir com crianças, sendo um excelente cão de família.',
    life: { min: 10, max: 12 },
    male_weight: { min: 27, max: 32 },
    female_weight: { min: 25, max: 29 },
    hypoallergenic: false,
  },
  bulldog: {
    description: 'O Bulldog é uma raça calma e corajosa, conhecida por sua aparência peculiar e temperamento gentil. Apesar da cara séria, é um cão muito carinhoso e bom com crianças.',
    life: { min: 8, max: 10 },
    male_weight: { min: 23, max: 25 },
    female_weight: { min: 18, max: 23 },
    hypoallergenic: false,
  },
  germanshepherd: {
    description: 'O Pastor Alemão é uma das raças mais versáteis e inteligentes do mundo. É muito usado em trabalhos policiais, militares e como cão de assistência.',
    life: { min: 9, max: 13 },
    male_weight: { min: 30, max: 40 },
    female_weight: { min: 22, max: 32 },
    hypoallergenic: false,
  },
  dachshund: {
    description: 'O Dachshund (Salsicha) foi originalmente criado para caçar animais em tocas. É corajoso, curioso e muito apegado à família.',
    life: { min: 12, max: 16 },
    male_weight: { min: 7, max: 14 },
    female_weight: { min: 7, max: 14 },
    hypoallergenic: false,
  },
}

function getFallbackBreed(slug) {
  const base = slug.split('/').pop().toLowerCase()
  return BREED_FALLBACK[base] || null
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
let dogApiAllBreedsFailed = false

async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(id)
    return res
  } catch (err) {
    clearTimeout(id)
    throw err
  }
}

async function fetchAllDogApiBreeds() {
  if (dogApiAllBreeds) return dogApiAllBreeds
  if (dogApiAllBreedsFailed) return []
  const all = []
  let page = 1

  while (true) {
    try {
      const res  = await fetchWithTimeout(`${DOG_CHARS_API}/breeds?page[number]=${page}&page[size]=50`)
      if (!res.ok) break
      const data = await res.json()
      if (!data?.data?.length) break
      all.push(...data.data)
      if (!data?.links?.next) break
      page++
      if (page > 10) break
    } catch {
      dogApiAllBreedsFailed = true
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
        const chars = breedData?.attributes || getFallbackBreed(slug)

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

    let englishFacts = null

    try {
      const res  = await fetchWithTimeout(`${DOG_CHARS_API}/facts?limit=10`)
      if (res.ok) {
        const data = await res.json()
        if (data?.data?.length) {
          englishFacts = data.data.map(item => item.attributes.body)
        }
      }
    } catch {
      // API indisponível — usa curiosidades de fallback
    }

    // Fallback quando dogapi.dog não responde
    if (!englishFacts) {
      englishFacts = [
        'Dogs have a sense of smell that is 10,000 to 100,000 times more powerful than humans.',
        'A dog\'s nose print is unique, just like a human fingerprint.',
        'Dogs can understand up to 250 words and gestures.',
        'The Basenji is the only breed of dog that cannot bark.',
        'Dogs sweat through their paw pads.',
        'A dog\'s heart beats between 60 and 140 times per minute.',
        'Three dogs survived the Titanic sinking — two Pomeranians and one Pekingese.',
        'Dogs have three eyelids: upper, lower, and a third called the nictitating membrane.',
        'The Labrador Retriever has been the most popular dog breed for over 30 consecutive years.',
        'Dogs can detect certain diseases, including some cancers, through their sense of smell.',
      ]
    }

    setProgress({ done: 0, total: englishFacts.length })

    // Traduz as curiosidades
    setStatus('translating')
    try {
      const translated = await translateSequential(
        englishFacts,
        (done, total) => setProgress({ done, total })
      )
      setFacts(translated)
      setStatus('done')
    } catch {
      // Se tradução falhar, exibe em inglês mesmo
      setFacts(englishFacts)
      setStatus('done')
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
