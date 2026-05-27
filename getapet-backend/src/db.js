const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/getapet'
    await mongoose.connect(uri)
    console.log(' MongoDB conectado com sucesso')
  } catch (error) {
    console.error(' Erro ao conectar no MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
