const { Recipe } = require('../models/Recipe');
const mongoose = require('mongoose');

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

async function getAll() {
    return Recipe.find().lean();
};

async function getLastThree() {
    return Recipe.find().sort({ createdAt: -1 }).limit(3).lean();
};

async function search(title) {
    let query = {};

    if (title) {
        query.title = new RegExp(title, 'i');
    }
    
    return Recipe.find(query).lean(); 

}

async function getByAuthorId(authorId) {
    return Recipe.find({ author: authorId }).lean();
}

async function getById(id) {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid ObjectId');
    }

    return Recipe.findById(id).lean();
};

async function create(data, authorId) {
    const record = new Recipe ({
        title: data.title,
        ingredients: data.ingredients,
        instructions: data.instructions,
        description: data.description,
        image: data.image,
        author: authorId
    });

    await record.save();
    
    return record;
};

async function update(id, data, userId) {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid ObjectId');
    }

    const record = await Recipe.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found ' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access denied!');
    }

    record.title = data.title;
    record.ingredients = data.ingredients;
    record.instructions = data.instructions;
    record.description = data.description;
    record.image = data.image;

    await record.save();

    return record;
}

async function addRecommend(recipesId, userId) {
    if (!isValidObjectId(recipesId)) {
        throw new Error('Invalid recipe ObjectId');
    }

    if (!isValidObjectId(userId)) {
        throw new Error('Invalid user ObjectId');
    }

    const recipe = await Recipe.findById(recipesId);

    if (!recipe) {
        throw new ReferenceError(`Recipe not found with id ${recipesId}`);
    }

    if (recipe.author.toString() === userId) {
        throw new Error('Cannot recommend your own recipe');
    }

    if (recipe.recommendList.find(r => r.toString() == userId)) {
        throw new Error('Recipe already recommended by this user');
    }

    recipe.recommendList.push(userId);

    await recipe.save();

    return recipe;
}


async function deleteById(id, userId) {
    const record = await Recipe.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found ' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access denied!');
    }

    await Recipe.findByIdAndDelete(id);
}

module.exports = {
    getAll,
    getLastThree,
    search,
    getByAuthorId,
    getById,
    create,
    update,
    addRecommend,
    deleteById
}