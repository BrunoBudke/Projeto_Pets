const mongoose = require('mongoose')

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome do pet é obrigatório'],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, 'A raça é obrigatória'],
      trim: true,
    },
    age: {
      type: String,
      required: [true, 'A idade é obrigatória'],
      trim: true,
    },
    weight: {
      type: String,
      required: [true, 'O peso é obrigatório'],
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'A cor é obrigatória'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adopter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Pet', petSchema)
