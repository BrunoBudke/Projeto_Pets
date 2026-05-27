const multer = require('multer')
const path = require('path')
const fs = require('fs')

const createStorage = (folder) => {
  const dir = path.resolve(__dirname, '..', '..', 'public', 'images', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const ext = path.extname(file.originalname)
      cb(null, `${uniqueSuffix}${ext}`)
    },
  })
}

const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Formato de imagem inválido. Use JPG, PNG, GIF ou WEBP.'), false)
  }
}

const userImageUpload = multer({
  storage: createStorage('users'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

const petImagesUpload = multer({
  storage: createStorage('pets'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

module.exports = { userImageUpload, petImagesUpload }
