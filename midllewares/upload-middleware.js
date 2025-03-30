// const multer = require('multer')
// const path = require('path')

// // set our multer storage
// const storage = multer.diskStorage({
//     destination : function(req, file, cb) {
//         cb(null, 'uploads/')
//     },

//     filename : function(req, file, cb) {
//         cb(null, 
//             file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//         )
//     }
// })

// // file filter functions
// const checkFileFilter = (req, file, cb) => {
//     if(file.mimetype.startsWith('image')) {
//         cb(null, true)
//     } else {
//         cb(new Error('Not an image! Please upload only images'))
//     }
// }

// module.exports = multer({
//     storage: storage,
//     fileFilter : checkFileFilter,
//     limits : {
//         fileSize : 5 * 1024 * 1024 // 5MB file size limit
//     }
// })


const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be stored
    },

    filename: function(req, file, cb) {
        // File name will include field name, timestamp, and file extension
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter function to check the type of file uploaded
const checkFileFilter = (req, file, cb) => {
    // Check if the file mimetype starts with 'image'
    if (file.mimetype.startsWith('image')) {
        cb(null, true);  // If it's an image, accept the file
    } else {
        // If it's not an image, reject with a custom error message
        cb(new Error('Not an image! Please upload only images.'));
    }
};

// Set up multer configuration
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB file size limit
    }
});
