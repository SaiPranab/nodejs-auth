const Image = require('../model/image')
const uploadToCloudinary = require('../helper/cloudinaryHelper')
const fs = require('fs')
const cloudinary = require('../config/cloudinary')

const uploadImageController = async (req, res) => {
    try {
        // check if file is missing in req object
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required!!! Please upload an image'
            })
        }

        // upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path)

        // store image url & publicid along with the uploaded user id in the database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        await newlyUploadedImage.save()

        // delte the image from local computer (very lastly we added - at the end of full testing after the codes)
        fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newlyUploadedImage
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong!!! Please try again'
        })
    }
}

const fetchImagesController = async (req, res) => {
    try {
        // we only required this when we want pagination - mu aeta pura last re perform karichhi
        const page = parseInt(req.query.page) || 1 // bydefault page is 1
        const limit = parseInt(req.query.limit) || 5 // how many images you want to see
        const skip = (page - 1) * limit

        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

        const totalImages = await Image.countDocuments()
        const totalPages = Math.ceil(totalImages / limit)

        const sortObj = {}
        sortObj[sortBy] = sortOrder

        // const images = await Image.find()

        // if(images) {
        //     res.status(200).json({
        //         success : true,
        //         data : images
        //     })
        // }

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit)
        if (images) {
            res.status(200).json({
                success: true,
                currentPage : page,
                totalPages : totalPages,
                totalImages : totalImages,
                data: images
            })
        }
    } catch (error) {

    }
}

const deleteImageController = async (req, res) => {
    try {
        const getCurrentIdOfImageToBeDeleted = req.params.id
        const userId = req.userInfo.userId

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted)

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image Not Found'
            })
        }

        // check if this image is uploaded by the current user who is trying to deleet the image
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image because you have not uploaded it'
            })
        }

        // delete this image from cloudinary 
        await cloudinary.uploader.destroy(image.publicId);

        // delete this image from mongodb database
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted)

        res.status(200).json({
            success: true,
            message: 'image deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Somethign went wrong! Please try again'
        })
    }
}

module.exports = {
    uploadImageController, fetchImagesController, deleteImageController
}