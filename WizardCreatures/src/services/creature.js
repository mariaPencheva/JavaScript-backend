const mongoose = require("mongoose");
const { Creature } = require("../models/Creature");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getMyCreatures(authorId) {
  try {
    const myCreatures = await Creature.find({ author: authorId }).populate('author').lean();

    return myCreatures;
  } catch (error) {
    console.error("Error fetching creatures:", error);
    throw error;
  }
}

async function getAll() {
  return Creature.find().lean();
}

async function getById(id) {
  if (!isValidObjectId(id)) {
    throw new Error("Invalid ObjectId");
  }
  
  return Creature.findById(id).populate('author votesList').lean();

}

async function create(data, authorId) {
  const record = new Creature({
    name: data.name,
    species: data.species,
    skinColor: data.skinColor,
    eyeColor: data.eyeColor,
    image: data.image,
    description: data.description,
    author: authorId,
  });

  await record.save();
  return record;
}

async function update(id, data, userId) {
  if (!isValidObjectId(id)) {
    throw new Error("Invalid ObjectId");
  }

  const record = await Creature.findById(id);

  if (!record) {
    throw new ReferenceError("Record not found " + id);
  }

  if (record.author.toString() != userId) {
    throw new Error("Access denied!");
  }

  record.name = data.name;
  record.species = data.species;
  record.skinColor = data.skinColor;
  record.eyeColor = data.eyeColor;
  record.image = data.image;
  record.description = data.description;

  await record.save();

  return record;
}

async function voted(creaturesId, userId) {
  if (!isValidObjectId(creaturesId)) {
    throw new Error("Invalid ObjectId");
  }

  const record = await Creature.findById(creaturesId);

  if (!record) {
    throw new ReferenceError("Record not found " + creaturesId);
  }

  if (record.author.toString() == userId) {
    throw new Error("Cannot recommend your own recipe!");
  }

  if (record.votesList.find((r) => r.toString() == userId)) {
    throw new Error("Only one recommendation is allowed!");
  }

  record.votesList.push(userId);

  await record.save();

  return record;
}

async function deleteById(id, userId) {
  if (!isValidObjectId(id)) {
    throw new Error("Invalid ObjectId");
  }

  const record = await Creature.findById(id);

  if (!record) {
    throw new ReferenceError("Record not found " + id);
  }

  if (record.author.toString() != userId) {
    throw new Error("Access denied!");
  }

  await Creature.findByIdAndDelete(id);
}

module.exports = {
  isValidObjectId,
  getAll,
  getMyCreatures,
  getById,
  create,
  update,
  voted,
  deleteById,
};
