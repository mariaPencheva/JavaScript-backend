const { Crypto } = require('../models/Crypto');

async function getAll() {
    return Crypto.find().lean();
};

async function getById(id) {
    return Crypto.findById(id).lean();
};

async function create(data, authorId) {
    const record = new Crypto ({
        name: data.name,
        image: data.image,
        price: data.price,
        description: data.description,
        paymentMethod: data.paymentMethod,
        author: authorId
    });

    await record.save();

    return record;
};

async function update(id, data, userId) {
    const record = await Crypto.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found ' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access denied!');
    }

    record.name = data.name;
    record.image = data.image;
    record.price = data.price;
    record.description = data.description;
    record.paymentMethod = data.paymentMethod;

    await record.save();
    return record;
}

async function deleteById(id, userId) {
    const record = await Crypto.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found ' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access denied!');
    }

    await Crypto.findByIdAndDelete(id);
}

async function bought(id, userId) {
    const crypto = await Crypto.findById(id);

    if (!crypto) {
      throw new Error('Crypto not found');
    }
  
    crypto.buyingList.push(userId);

    await crypto.save();

    return crypto;
}

async function search(criteria) {
    if (criteria){
        return Crypto.find(criteria).lean();

    } else {
        return getAll();
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    bought,
    search
}