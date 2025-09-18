const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String },
    commentcount: { type: Number, default: 0 },
    comments: { type: Array, default: [] },
})

module.exports = mongoose.model('Book', BookSchema);