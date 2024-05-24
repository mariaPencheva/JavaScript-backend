const mongoose = require('mongoose');
require('../models/User');
require('../models/Product');

const connectionString = 'mongodb://127.0.0.1:27017/techStoreDB';

async function configDatabase() {
    await mongoose.connect(connectionString);
    console.log('Database connected');
}

module.exports = { configDatabase };