const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
    authSource: "admin",
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})