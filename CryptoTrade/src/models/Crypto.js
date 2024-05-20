const { Schema, model, Types } = require('mongoose');

const cryptoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'],
        required: true
    },
    buyingList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    author: {
        type: Types.ObjectId,
        ref: 'User'
    }

});

const Crypto = model('Crypto', cryptoSchema);

module.exports = { Crypto };