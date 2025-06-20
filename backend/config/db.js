const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auth: {
                username: process.env.MONGO_USER || 'appUser',
                password: process.env.MONGO_PASS || 'appPassword123'
            },
            authSource: 'red-admin'
        });
        console.log('✅ MongoDB conectado correctamente');
    } catch (err) {
        console.error('❌ Error de conexión a MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;