const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL);

        console.log(`Check Mongo DB Connection: ${connect.connection.host}`);
    } catch (error) {
        console.log(`Database connection error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;