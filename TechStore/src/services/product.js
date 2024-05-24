const { Product } = require('../models/Product');

const getAll = async () => {
    return await Product.find().lean();
};

async function getById(id) {
    return Product.findById(id).lean();
};

async function getLastThree() {
    return Product.find().sort({ createdAt: -1 }).limit(3).lean();
};

async function create(data, authorId) {

    const record = new Product ({
        brand: data.brand,
        productModel: data.productModel,
        hardDisk: data.hardDisk,
        screenSize: data.screenSize,
        ram: data.ram,
        operatingSystem: data.operatingSystem,
        cpu: data.cpu,
        gpu: data.gpu,
        price: data.price,
        color: data.color,
        weight: data.weight,
        image: data.image,
        author: authorId
    });

    await record.save();
    return record;
};

async function update(id, data, userId) {
    const record = await Product.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found ' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access denied!');
    }

    record.brand = data.brand;
    record.productModel = data.productModel;
    record.hardDisk = data.hardDisk;
    record.screenSize = data.screenSize;
    record.ram = data.ram;
    record.operatingSystem = data.operatingSystem;
    record.cpu = data.cpu;
    record.gpu = data.gpu;
    record.price = data.price;
    record.color = data.color;
    record.weight = data.weight;
    record.image = data.image;


    await record.save();
    return record;
}

async function deleteById(id, userId) {
    const record = await Product.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found ' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access denied!');
    }

    await Product.findByIdAndDelete(id);
}

async function getMyCreatedProducts(userId) {
    try {
        return await Product.find({ author: userId }).lean();
    } catch (err) {
        throw new Error('Error fetching created products: ' + err.message);
    }
}

async function getMyPreferredProducts(userId) {
    try {
        return await Product.find({ preferredList: userId }).lean();
    } catch (err) {
        throw new Error('Error fetching preferred products: ' + err.message);
    }
}

async function isPreferred(userId, id) {
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product.preferredList.includes(userId);
    } catch (err) {
        throw err;
    }
}

async function preferProduct(id, userId) {
    try {
        const product = await Product.findById(id);

        if (!product) {
            throw new Error('Product not found');
        }

        if (product.preferredList.includes(userId)) {
            throw new Error('Product already preferred');
        }

        product.preferredList.push(userId);
        await product.save();
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getAll,
    getById,
    getLastThree,
    create,
    update,
    deleteById,
    getMyCreatedProducts,
    getMyPreferredProducts,
    isPreferred,
    preferProduct
}