require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(` Servidor rodando em http://localhost:${PORT}`)
  })

  const shutdown = (signal) => {
    console.log(`\n ${signal} recebido — encerrando servidor...`)
    server.close(() => {
      console.log(' Porta liberada com sucesso.')
      mongoose.connection.close(false).then(() => {
        console.log(' Conexão com MongoDB encerrada.')
        process.exit(0)
      })
    })
    setTimeout(() => {
      console.error('  Encerramento forçado.')
      process.exit(1)
    }, 5000)
  }

  process.on('SIGINT',  () => shutdown('SIGINT'))   
  process.on('SIGTERM', () => shutdown('SIGTERM')) 
  process.on('SIGHUP',  () => shutdown('SIGHUP'))   
})
