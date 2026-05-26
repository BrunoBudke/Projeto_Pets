const express = require('express')
const router = express.Router()
const {
  getAll,
  getById,
  create,
  update,
  remove,
  adopt,
  getMyPets,
} = require('../controllers/PetController')
const authMiddleware = require('../middleware/auth')
const { petImagesUpload } = require('../middleware/upload')

// Rotas públicas
router.get('/', getAll)
router.get('/mypets', authMiddleware, getMyPets)
router.get('/:id', getById)

// Rotas protegidas
router.post('/', authMiddleware, petImagesUpload.array('images', 10), create)
router.put('/:id', authMiddleware, petImagesUpload.array('images', 10), update)
router.delete('/:id', authMiddleware, remove)
router.patch('/:id/adopt', authMiddleware, adopt)

module.exports = router
