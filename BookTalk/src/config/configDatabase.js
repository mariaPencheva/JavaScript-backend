const mongoose = require('mongoose');
require('../models/User');
require('../models/Book');

const connectionString = 'mongodb://127.0.0.1:27017/bookTalkDB';

async function configDatabase() {
    await mongoose.connect(connectionString);
    console.log('Database connected');
}

module.exports = { configDatabase };