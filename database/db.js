const mongoose = require('mongoose')

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.error('MongoDB created successfully')
    } catch (error) {
        console.log(error);
        
        console.error('MongoDB connection failed')
    }
}

module.exports = connectToDB