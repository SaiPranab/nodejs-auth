const express = require('express')
const authMiddleware = require('../midllewares/auth-midlleware')
const isAdminUser = require('../midllewares/admin-middleware')
const uploadMiddleware = require('../midllewares/upload-middleware')
const { uploadImageController, fetchImagesController, deleteImageController } = require('../controllers/image-controller')
const router = express.Router()

// upload the image
router.post('/upload', authMiddleware, isAdminUser, uploadMiddleware.single('image'), uploadImageController)

// get all the images
router.get('/get', authMiddleware, fetchImagesController)

// delete image route
router.delete('/:id', authMiddleware, isAdminUser, deleteImageController)

// get all the images
module.exports = router