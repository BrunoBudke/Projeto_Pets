const UserController = require('../src/controllers/UserController')
const User = require('../src/models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

jest.mock('../src/models/User')
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json   = jest.fn().mockReturnValue(res)
  return res
}

//POST /users/register
describe('UserController.register', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve cadastrar usuário com dados válidos', async () => {
    const req = { body: { name: 'João', email: 'j@test.com', password: '123456' }, file: null }
    const res = mockRes()

    User.findOne.mockResolvedValue(null)
    bcrypt.genSalt.mockResolvedValue('salt')
    bcrypt.hash.mockResolvedValue('hashedpwd')
    User.create.mockResolvedValue({ _id: 'uid1', name: 'João', email: 'j@test.com' })

    await UserController.register(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }))
  })

  test('deve retornar 422 quando campos obrigatórios faltam', async () => {
    const req = { body: { email: 'j@test.com' }, file: null }
    const res = mockRes()

    await UserController.register(req, res)

    expect(res.status).toHaveBeenCalledWith(422)
  })

  test('deve retornar 422 quando email já existe', async () => {
    const req = { body: { name: 'João', email: 'j@test.com', password: '123456' }, file: null }
    const res = mockRes()

    User.findOne.mockResolvedValue({ email: 'j@test.com' })

    await UserController.register(req, res)

    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/e-mail já cadastrado/i) }))
  })

  test('deve incluir filename da imagem quando arquivo enviado', async () => {
    const req = { body: { name: 'João', email: 'j@test.com', password: '123456' }, file: { filename: 'foto.jpg' } }
    const res = mockRes()

    User.findOne.mockResolvedValue(null)
    bcrypt.genSalt.mockResolvedValue('salt')
    bcrypt.hash.mockResolvedValue('hashedpwd')
    User.create.mockResolvedValue({ _id: 'uid1', name: 'João', email: 'j@test.com' })

    await UserController.register(req, res)

    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ image: 'foto.jpg' }))
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test('deve retornar 422 em erro de validação do Mongoose', async () => {
    const req = { body: { name: 'João', email: 'invalido', password: '123456' }, file: null }
    const res = mockRes()

    User.findOne.mockResolvedValue(null)
    bcrypt.genSalt.mockResolvedValue('salt')
    bcrypt.hash.mockResolvedValue('hashedpwd')

    const validationError = { name: 'ValidationError', errors: { email: { message: 'E-mail inválido' } } }
    User.create.mockRejectedValue(validationError)

    await UserController.register(req, res)

    expect(res.status).toHaveBeenCalledWith(422)
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = { body: { name: 'João', email: 'j@test.com', password: '123456' }, file: null }
    const res = mockRes()

    User.findOne.mockRejectedValue(new Error('DB error'))

    await UserController.register(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

//POST login
describe('UserController.login', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve fazer login com credenciais válidas', async () => {
    const req = { body: { email: 'j@test.com', password: '123456' } }
    const res = mockRes()

    User.findOne.mockResolvedValue({ _id: 'uid1', name: 'João', email: 'j@test.com', password: 'hashed', phone: '', image: '' })
    bcrypt.compare.mockResolvedValue(true)
    jwt.sign.mockReturnValue('jwt_token_123')

    await UserController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'jwt_token_123' }))
  })

  test('deve retornar 422 quando campos faltam', async () => {
    const req = { body: { email: 'j@test.com' } }
    const res = mockRes()

    await UserController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(422)
  })

  test('deve retornar 404 quando usuário não existe', async () => {
    const req = { body: { email: 'naoexiste@test.com', password: '123456' } }
    const res = mockRes()

    User.findOne.mockResolvedValue(null)

    await UserController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 422 quando senha incorreta', async () => {
    const req = { body: { email: 'j@test.com', password: 'errada' } }
    const res = mockRes()

    User.findOne.mockResolvedValue({ _id: 'uid1', name: 'João', email: 'j@test.com', password: 'hashed' })
    bcrypt.compare.mockResolvedValue(false)

    await UserController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/senha incorreta/i) }))
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = { body: { email: 'j@test.com', password: '123456' } }
    const res = mockRes()

    User.findOne.mockRejectedValue(new Error('DB error'))

    await UserController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

// Get-profile 
describe('UserController.getProfile', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve retornar perfil do usuário autenticado', async () => {
    const req = { userId: 'uid1' }
    const res = mockRes()

    const selectMock = jest.fn().mockResolvedValue({ _id: 'uid1', name: 'João', email: 'j@test.com' })
    User.findById.mockReturnValue({ select: selectMock })

    await UserController.getProfile(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: expect.any(Object) }))
  })

  test('deve retornar 404 quando usuário não encontrado', async () => {
    const req = { userId: 'uid_inexistente' }
    const res = mockRes()

    const selectMock = jest.fn().mockResolvedValue(null)
    User.findById.mockReturnValue({ select: selectMock })

    await UserController.getProfile(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = { userId: 'uid1' }
    const res = mockRes()

    User.findById.mockReturnValue({ select: jest.fn().mockRejectedValue(new Error('DB error')) })

    await UserController.getProfile(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})
