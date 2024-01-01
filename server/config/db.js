const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
     }
}

module.exports = connectDB;