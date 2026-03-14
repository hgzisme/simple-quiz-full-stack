const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    options: [String],
    keywords: [String],
    correctedAnswerIndex: { type: Number, required: true }
})

module.exports = mongoose.model('Question', questionSchema);