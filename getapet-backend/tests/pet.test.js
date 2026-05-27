const PetController = require('../src/controllers/PetController')
const Pet = require('../src/models/Pet')

jest.mock('../src/models/Pet')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json   = jest.fn().mockReturnValue(res)
  return res
}

const OWN_USER   = 'user_owner_id'
const OTHER_USER = 'user_other_id'

const makePet = (overrides = {}) => ({
  _id: 'pet1',
  name: 'Rex',
  breed: 'Labrador',
  age: '2 anos',
  weight: '15 kg',
  color: 'Amarelo',
  available: true,
  owner: { toString: () => OWN_USER },
  save: jest.fn().mockResolvedValue(true),
  ...overrides,
})

describe('PetController.getAll', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve retornar lista de pets', async () => {
    const req = {}
    const res = mockRes()
    const sortMock = jest.fn().mockReturnThis()
    const populateMock = jest.fn().mockResolvedValue([makePet()])
    Pet.find.mockReturnValue({ sort: sortMock, populate: populateMock })
    sortMock.mockReturnValue({ populate: populateMock })

    await PetController.getAll(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ pets: expect.any(Array) }))
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = {}
    const res = mockRes()
    Pet.find.mockReturnValue({ sort: jest.fn().mockReturnThis(), populate: jest.fn().mockRejectedValue(new Error('DB error')) })

    await PetController.getAll(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

// ── get /pet id -
describe('PetController.getById', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve retornar pet por ID', async () => {
    const req = { params: { id: 'pet1' } }
    const res = mockRes()
    const populateMock = jest.fn().mockResolvedValue(makePet())
    Pet.findById.mockReturnValue({ populate: populateMock })

    await PetController.getById(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ pet: expect.any(Object) }))
  })

  test('deve retornar 404 quando pet não encontrado', async () => {
    const req = { params: { id: 'pet_inexistente' } }
    const res = mockRes()
    Pet.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) })

    await PetController.getById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 404 para CastError (ID inválido)', async () => {
    const req = { params: { id: 'id-invalido' } }
    const res = mockRes()
    const castError = Object.assign(new Error('Cast error'), { name: 'CastError' })
    Pet.findById.mockReturnValue({ populate: jest.fn().mockRejectedValue(castError) })

    await PetController.getById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = { params: { id: 'pet1' } }
    const res = mockRes()
    Pet.findById.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error('DB error')) })

    await PetController.getById(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})
// Post dos pets
describe('PetController.create', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve criar pet com dados válidos', async () => {
    const req = {
      body: { name: 'Rex', breed: 'Lab', age: '2 anos', weight: '15kg', color: 'Amarelo' },
      files: [{ filename: 'foto1.jpg' }],
      userId: OWN_USER,
    }
    const res = mockRes()
    Pet.create.mockResolvedValue(makePet())

    await PetController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
  })

  test('deve criar pet sem imagens (files vazio)', async () => {
    const req = {
      body: { name: 'Rex', breed: 'Lab', age: '2 anos', weight: '15kg', color: 'Amarelo' },
      files: null,
      userId: OWN_USER,
    }
    const res = mockRes()
    Pet.create.mockResolvedValue(makePet())

    await PetController.create(req, res)

    expect(Pet.create).toHaveBeenCalledWith(expect.objectContaining({ images: [] }))
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test('deve retornar 422 quando campos obrigatórios faltam', async () => {
    const req = { body: { name: 'Rex' }, files: [], userId: OWN_USER }
    const res = mockRes()

    await PetController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(422)
  })

  test('deve retornar 422 em ValidationError do Mongoose', async () => {
    const req = {
      body: { name: 'Rex', breed: 'Lab', age: '2 anos', weight: '15kg', color: 'Amarelo' },
      files: [],
      userId: OWN_USER,
    }
    const res = mockRes()
    const validationError = { name: 'ValidationError', errors: { name: { message: 'Nome inválido' } } }
    Pet.create.mockRejectedValue(validationError)

    await PetController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(422)
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = {
      body: { name: 'Rex', breed: 'Lab', age: '2 anos', weight: '15kg', color: 'Amarelo' },
      files: [],
      userId: OWN_USER,
    }
    const res = mockRes()
    Pet.create.mockRejectedValue(new Error('DB error'))

    await PetController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

// ── PUT - pets-id
describe('PetController.update', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve atualizar pet quando é o tutor', async () => {
    const req = {
      params: { id: 'pet1' },
      body: { name: 'Rex Atualizado', available: 'true' },
      files: [],
      userId: OWN_USER,
    }
    const res = mockRes()
    Pet.findById.mockResolvedValue(makePet())

    await PetController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/atualizado/i) }))
  })

  test('deve atualizar imagens quando enviadas', async () => {
    const req = {
      params: { id: 'pet1' },
      body: {},
      files: [{ filename: 'nova.jpg' }],
      userId: OWN_USER,
    }
    const res = mockRes()
    const pet = makePet()
    Pet.findById.mockResolvedValue(pet)

    await PetController.update(req, res)

    expect(pet.images).toEqual(['nova.jpg'])
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test('deve retornar 403 quando outro usuário tenta atualizar', async () => {
    const req = {
      params: { id: 'pet1' },
      body: { name: 'Invasor' },
      files: [],
      userId: OTHER_USER,
    }
    const res = mockRes()
    Pet.findById.mockResolvedValue(makePet())

    await PetController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
  })

  test('deve retornar 404 quando pet não encontrado', async () => {
    const req = { params: { id: 'inexistente' }, body: {}, files: [], userId: OWN_USER }
    const res = mockRes()
    Pet.findById.mockResolvedValue(null)

    await PetController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 404 para CastError', async () => {
    const req = { params: { id: 'id-invalido' }, body: {}, files: [], userId: OWN_USER }
    const res = mockRes()
    Pet.findById.mockRejectedValue(Object.assign(new Error('Cast'), { name: 'CastError' }))

    await PetController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = { params: { id: 'pet1' }, body: {}, files: [], userId: OWN_USER }
    const res = mockRes()
    Pet.findById.mockRejectedValue(new Error('DB error'))

    await PetController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

// ── Dekelete - pets:ID
describe('PetController.remove', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve remover pet quando é o tutor', async () => {
    const req = { params: { id: 'pet1' }, userId: OWN_USER }
    const res = mockRes()
    Pet.findById.mockResolvedValue(makePet())
    Pet.findByIdAndDelete.mockResolvedValue(true)

    await PetController.remove(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/removido/i) }))
  })

  test('deve retornar 403 quando outro usuário tenta remover', async () => {
    const req = { params: { id: 'pet1' }, userId: OTHER_USER }
    const res = mockRes()
    Pet.findById.mockResolvedValue(makePet())

    await PetController.remove(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
  })

  test('deve retornar 404 quando pet não encontrado', async () => {
    const req = { params: { id: 'inexistente' }, userId: OWN_USER }
    const res = mockRes()
    Pet.findById.mockResolvedValue(null)

    await PetController.remove(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 404 para CastError', async () => {
    const req = { params: { id: 'id-invalido' }, userId: OWN_USER }
    const res = mockRes()
    Pet.findById.mockRejectedValue(Object.assign(new Error('Cast'), { name: 'CastError' }))

    await PetController.remove(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = { params: { id: 'pet1' }, userId: OWN_USER }
    const res = mockRes()
    Pet.findById.mockRejectedValue(new Error('DB error'))

    await PetController.remove(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

//PATCH pets-ID-adopt
describe('PetController.adopt', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve adotar pet com sucesso', async () => {
    const req = { params: { id: 'pet1' }, userId: OTHER_USER }
    const res = mockRes()
    Pet.findById.mockResolvedValue(makePet())

    await PetController.adopt(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/adotado/i) }))
  })

  test('deve retornar 400 quando pet já foi adotado', async () => {
    const req = { params: { id: 'pet1' }, userId: OTHER_USER }
    const res = mockRes()
    Pet.findById.mockResolvedValue(makePet({ available: false }))

    await PetController.adopt(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/já foi adotado/i) }))
  })

  test('deve retornar 400 quando tutor tenta adotar o próprio pet', async () => {
    const req = { params: { id: 'pet1' }, userId: OWN_USER }
    const res = mockRes()
    Pet.findById.mockResolvedValue(makePet())

    await PetController.adopt(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/próprio pet/i) }))
  })

  test('deve retornar 404 quando pet não encontrado', async () => {
    const req = { params: { id: 'inexistente' }, userId: OTHER_USER }
    const res = mockRes()
    Pet.findById.mockResolvedValue(null)

    await PetController.adopt(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 404 para CastError', async () => {
    const req = { params: { id: 'id-invalido' }, userId: OTHER_USER }
    const res = mockRes()
    Pet.findById.mockRejectedValue(Object.assign(new Error('Cast'), { name: 'CastError' }))

    await PetController.adopt(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = { params: { id: 'pet1' }, userId: OTHER_USER }
    const res = mockRes()
    Pet.findById.mockRejectedValue(new Error('DB error'))

    await PetController.adopt(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

//  GET-- /pets/mypets
describe('PetController.getMyPets', () => {
  beforeEach(() => jest.clearAllMocks())

  test('deve retornar apenas pets do usuário autenticado', async () => {
    const req = { userId: OWN_USER }
    const res = mockRes()
    Pet.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([makePet()]) })

    await PetController.getMyPets(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ pets: expect.any(Array) }))
  })

  test('deve retornar 500 em erro inesperado', async () => {
    const req = { userId: OWN_USER }
    const res = mockRes()
    Pet.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB error')) })

    await PetController.getMyPets(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})
