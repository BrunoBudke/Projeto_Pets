const express = require('express')
const cors = require('cors')
const path = require('path')

const userRoutes = require('./routes/userRoutes')
const petRoutes = require('./routes/petRoutes')

const app = express()

//Middlewares//
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// imagebs//
app.use('/images', express.static(path.resolve(__dirname, '..', 'public', 'images')))

app.use('/users', userRoutes)
app.use('/pets', petRoutes)

//Teste//
app.get('/', (_req, res) => {
  res.status(200).json({
    message: ' Get A Pet API está rodando!',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      pets: '/pets',
      images: '/images',
    },
  })
})

app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' })
})

app.use((error, _req, res, _next) => {
  console.error('[GlobalErrorHandler]', error)

  if (error.message && error.message.includes('Formato de imagem inválido')) {   
    return res.status(422).json({ message: error.message })
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(422).json({ message: 'Arquivo muito grande. Máximo 5 MB.' })
  }

  return res.status(500).json({ message: 'Erro interno no servidor.' })
})

module.exports = app

// Get A Pet - API v1.0