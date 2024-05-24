const { Schema, model, Types } = require('mongoose');

 const productSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    productModel: {
        type: String,
        required: true
    },
    hardDisk: {
        type: String,
        required: true
    },
    screenSize: {
        type: String,
        required: true
    },
    ram: {
        type: String,
        required: true
    },
    operatingSystem: {
        type: String,
        required: true
    },
    cpu: {
        type: String,
        required: true
    },
    gpu: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    weight:  {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    preferredList: {
        type: [Types.ObjectId],
        ref: 'User',
        default: []
    },
    author: {
        type: Types.ObjectId,
        ref: 'User'
    }

 });

const Product = model('Product', productSchema);

module.exports = { Product };