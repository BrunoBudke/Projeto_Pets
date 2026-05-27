const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'getapet_secret_jwt_2024'
const JWT_EXPIRES = '7d'

const generateToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES })

// POST /users/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return res.status(422).json({ message: 'Nome, e-mail e senha são obrigatórios.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(422).json({ message: 'E-mail já cadastrado. Use outro e-mail.' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const image = req.file ? req.file.filename : ''

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      image,
    })

    return res.status(201).json({
      message: 'Conta criada com sucesso!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(422).json({ message: messages[0] })
    }
    console.error('[UserController.register]', error)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
}

// POST /users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(422).json({ message: 'E-mail e senha são obrigatórios.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(422).json({ message: 'Senha incorreta.' })
    }

    const token = generateToken(user._id)

    return res.status(200).json({
      message: `Olá, ${user.name}! Login realizado com sucesso.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
    })
  } catch (error) {
    console.error('[UserController.login]', error)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
}

// GET /users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error('[UserController.getProfile]', error)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
}

module.exports = { register, login, getProfile }
