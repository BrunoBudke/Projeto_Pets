const Pet = require('../models/Pet')

// GET /pets
const getAll = async (req, res) => {
  try {
    const pets = await Pet.find().sort('-createdAt').populate('owner', 'name phone')
    return res.status(200).json({ pets })
  } catch (error) {
    console.error('[PetController.getAll]', error)
    return res.status(500).json({ message: 'Erro ao buscar pets.' })
  }
}

// GET /pets/:id
const getById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner', 'name phone image')

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }

    return res.status(200).json({ pet })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }
    console.error('[PetController.getById]', error)
    return res.status(500).json({ message: 'Erro ao buscar pet.' })
  }
}

// POST /pets
const create = async (req, res) => {
  try {
    const { name, breed, age, weight, color, description } = req.body

    if (!name || !breed || !age || !weight || !color) {
      return res.status(422).json({ message: 'Nome, raça, idade, peso e cor são obrigatórios.' })
    }

    const images = req.files ? req.files.map((f) => f.filename) : []

    const pet = await Pet.create({
      name,
      breed,
      age,
      weight,
      color,
      description: description || '',
      images,
      owner: req.userId,
      available: true,
    })

    return res.status(201).json({ message: 'Pet cadastrado com sucesso!', pet })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return res.status(422).json({ message: messages[0] })
    }
    console.error('[PetController.create]', error)
    return res.status(500).json({ message: 'Erro ao cadastrar pet.' })
  }
}

// PUT /pets:id
const update = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }

    if (pet.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado. Você não é o tutor deste pet.' })
    }

    const { name, breed, age, weight, color, description, available } = req.body
    const newImages = req.files ? req.files.map((f) => f.filename) : []

    if (name !== undefined) pet.name = name
    if (breed !== undefined) pet.breed = breed
    if (age !== undefined) pet.age = age
    if (weight !== undefined) pet.weight = weight
    if (color !== undefined) pet.color = color
    if (description !== undefined) pet.description = description
    if (available !== undefined) pet.available = available === 'true' || available === true
    if (newImages.length > 0) pet.images = newImages

    await pet.save()

    return res.status(200).json({ message: 'Pet atualizado com sucesso!', pet })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }
    console.error('[PetController.update]', error)
    return res.status(500).json({ message: 'Erro ao atualizar pet.' })
  }
}

// DELETE /pets:id
const remove = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }

    if (pet.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado. Você não é o tutor deste pet.' })
    }

    await Pet.findByIdAndDelete(req.params.id)

    return res.status(200).json({ message: 'Pet removido com sucesso.' })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }
    console.error('[PetController.remove]', error)
    return res.status(500).json({ message: 'Erro ao remover pet.' })
  }
}

// PATCH /pets:id-adopt
const adopt = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }

    if (!pet.available) {
      return res.status(400).json({ message: 'Este pet já foi adotado.' })
    }

    if (pet.owner.toString() === req.userId) {
      return res.status(400).json({ message: 'Você não pode adotar seu próprio pet.' })
    }

    pet.available = false
    pet.adopter = req.userId
    await pet.save()

    return res.status(200).json({ message: `${pet.name} foi adotado com sucesso! 🎉`, pet })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }
    console.error('[PetController.adopt]', error)
    return res.status(500).json({ message: 'Erro ao processar adoção.' })
  }
}

// GET//
const getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.userId }).sort('-createdAt')
    return res.status(200).json({ pets })
  } catch (error) {
    console.error('[PetController.getMyPets]', error)
    return res.status(500).json({ message: 'Erro ao buscar seus pets.' })
  }
}

module.exports = { getAll, getById, create, update, remove, adopt, getMyPets }
