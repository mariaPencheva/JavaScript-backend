const { Schema, model, Types } = require('mongoose');

 const creatureSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    species: {
        type: String,
        required: true
    },
    skinColor: {
        type: String,
        required: true
    },
    eyeColor: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    votesList: [{ 
        type: Types.ObjectId,
        ref: 'User',
        default: []
    }],
    author: {
        type: Types.ObjectId,
        ref: 'User'
    }

 });

const Creature = model('Creature', creatureSchema);

module.exports = { Creature };