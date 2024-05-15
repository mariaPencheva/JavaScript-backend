const { User } = require('../models/User');
const bcrypt = require('bcrypt');

const identityName = 'email';

async function register(firstName, lastName, identity, password) {
    const existing = await User.findOne({[identityName]: identity});

    if (existing) {
        throw new Error(`This ${identityName} is already in use.`);
    }

    const user = new User({
        firstName,
        lastName,
        [identityName]: identity,
        password: await bcrypt.hash(password, 10)
    });

    await user.save();

    return user;
}

async function login(identity, password){
    try {
        const query = {};
        query[identityName] = identity;

        const user = await User.findOne(query);

        if (!user) {
            throw new Error(`User with email ${identity} not found.`);
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error(`Incorrect password for email ${identity}.`);
        }

        return user;
    } catch (err) {
        throw new Error(`Incorrect email or password.`);
    }
}

module.exports = { 
    register,
    login
}