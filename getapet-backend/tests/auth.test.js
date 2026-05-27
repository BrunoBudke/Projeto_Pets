const authMiddleware = require('../src/middleware/auth')
const jwt = require('jsonwebtoken')

jest.mock('jsonwebtoken')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json   = jest.fn().mockReturnValue(res)
  return res
}

describe('authMiddleware', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve chamar next() quando token válido', () => {
    const req = { headers: { authorization: 'Bearer valid_token' } }
    const res = mockRes()
    const next = jest.fn()
    jwt.verify.mockReturnValue({ id: 'user123' })

    authMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.userId).toBe('user123')
  })

  test('deve retornar 401 sem header authorization', () => {
    const req = { headers: {} }
    const res = mockRes()
    const next = jest.fn()

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('deve retornar 401 quando header não começa com Bearer', () => {
    const req = { headers: { authorization: 'Basic abc123' } }
    const res = mockRes()
    const next = jest.fn()

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('deve retornar 401 com mensagem de token expirado', () => {
    const req = { headers: { authorization: 'Bearer expired_token' } }
    const res = mockRes()
    const next = jest.fn()
    const expiredError = Object.assign(new Error('jwt expired'), { name: 'TokenExpiredError' })
    jwt.verify.mockImplementation(() => { throw expiredError })

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/expirado/i) }))
    expect(next).not.toHaveBeenCalled()
  })

  test('deve retornar 401 com token inválido', () => {
    const req = { headers: { authorization: 'Bearer invalid_token' } }
    const res = mockRes()
    const next = jest.fn()
    jwt.verify.mockImplementation(() => { throw new Error('invalid signature') })

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/inválido/i) }))
    expect(next).not.toHaveBeenCalled()
  })
})
