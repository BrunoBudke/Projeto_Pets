const express = require('express')
const router = express.Router()
const { register, login, getProfile } = require('../controllers/UserController')
const authMiddleware = require('../middleware/auth')
const { userImageUpload } = require('../middleware/upload')

router.post('/register', userImageUpload.single('image'), register)
router.post('/login', login)
router.get('/profile', authMiddleware, getProfile)

module.exports = router
